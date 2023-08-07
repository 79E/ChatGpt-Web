import drawStore from '../draw/slice';
import { getDrawImages, setDrawImages } from '@/request/api';

async function fetchDrawImages(params: {
    page: number,
    page_size: number,
    type: 'gallery' | 'me' | string
}) {
    const res = await getDrawImages(params)
    if (!res.code) {
        drawStore.getState().changeDrawImage(params.type, res.data.rows, params.page)
    }
    return res
}

async function fetchSetDrawImages(params: {
    id?: string | number,
    status?: number
}) {
    const res = await setDrawImages(params)
    if (!res.code && !params.id) {
        drawStore.getState().clearhistoryDrawImages()
    } else if (!res.code && params.id) {
        drawStore.getState().setHistoryDrawImages(params.id, params.status)
    }
    return res
}

export default {
    fetchDrawImages,
    fetchSetDrawImages
};
