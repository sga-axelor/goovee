import { getTheme } from '@/orm/webTheme'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

type ResponseData = {
    message: string
}

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    try {
        let theme = await getTheme()
        if (theme) {
            return NextResponse.json({
                status: 200,
                theme
            })
        } else {
            return NextResponse.json({
                status: 400,
                theme
            })
        }

    } catch (error) {
        return NextResponse.json({
            status: 500,
            error
        })
    }

}