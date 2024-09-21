import { queryClient } from '@/app/functions/db'

export async function GET() {
  try {
    const queryResult = await queryClient`SELECT NOW() AS agora`
    const { agora } = queryResult[0]
    return Response.json({
      nextjs: {
        live: true,
        when: new Date().toISOString()
      },
      database: {
        live: Boolean(agora),
        when: new Date(agora).toISOString()
      }
    })
  } catch (error) {
    return Response.json({
      live: false,
      when: new Date().toISOString()
    })
  }
}
