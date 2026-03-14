import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { diets, athletes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const JWT_SECRET = process.env.NEXTAUTH_SECRET!

function extractUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { athleteId, organizationId, type, dietName } = await request.json()

    if (!athleteId || !organizationId || !type) {
      return NextResponse.json(
        { message: 'athleteId, organizationId e type são obrigatórios' },
        { status: 400 }
      )
    }

    // Fetch athlete data
    const [athlete] = await db
      .select()
      .from(athletes)
      .where(eq(athletes.id, athleteId))

    if (!athlete) {
      return NextResponse.json(
        { message: 'Atleta não encontrado' },
        { status: 404 }
      )
    }

    // Generate diet with AI
    const prompt = `
    Você é um nutricionista especializado em esporte e Jiu-Jitsu. 
    
    Dados do atleta:
    - Nome: ${athlete.name}
    - Peso: ${athlete.weight} kg
    - Altura: ${athlete.height} cm
    - Peso alvo: ${athlete.targetWeight} kg
    - Esporte: ${athlete.sport}
    - Tipo de dieta: ${type}
    
    Gere um plano nutricional personalizado em JSON com a seguinte estrutura:
    {
      "dailyCalories": número,
      "protein": número,
      "carbs": número,
      "fat": número,
      "meals": [
        {
          "name": "Café da Manhã",
          "foods": ["item 1", "item 2"],
          "calories": número
        }
      ]
    }
    
    Responda APENAS com o JSON válido, sem explicações adicionais.
    `

    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    let dietData
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      dietData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text)
    } catch (e) {
      console.error('[v0] Failed to parse AI response:', text)
      // Provide fallback diet data
      dietData = {
        dailyCalories: 2500,
        protein: 180,
        carbs: 280,
        fat: 85,
        meals: [
          {
            name: 'Café da Manhã',
            foods: ['Ovos', 'Pão integral', 'Café'],
            calories: 600,
          },
        ],
      }
    }

    // Save diet to database
    const [newDiet] = await db
      .insert(diets)
      .values({
        athleteId,
        organizationId,
        name: dietName || `Dieta ${type} - ${new Date().toLocaleDateString('pt-BR')}`,
        type: type as any,
        dailyCalories: dietData.dailyCalories,
        protein: dietData.protein?.toString(),
        carbs: dietData.carbs?.toString(),
        fat: dietData.fat?.toString(),
        meals: dietData.meals,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .returning()

    return NextResponse.json(newDiet, { status: 201 })
  } catch (error) {
    console.error('[v0] Error generating diet:', error)
    return NextResponse.json(
      { message: 'Erro ao gerar dieta' },
      { status: 500 }
    )
  }
}
