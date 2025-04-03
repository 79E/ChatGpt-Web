function dataURItoFile(dataURI?: string, filename = 'image') {
    if(!dataURI) return undefined;

    function getMimeType(base64Data) {
        const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64/);
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return null;
    }

    // 将Base64字符串分割为头部和数据部分
    const [mimeType, base64Data] = dataURI.split(',');

    const type = getMimeType(mimeType) || 'image/png';

    const [,mime] = type.split('/');

    // 将Base64数据解码为字节数组
    const buffer = Buffer.from(base64Data, 'base64');

    return {
        buffer,
        fieldname: filename,
        originalname: `${filename}.${mime}`,
        mimetype: type,
    };
}

export default dataURItoFile;
