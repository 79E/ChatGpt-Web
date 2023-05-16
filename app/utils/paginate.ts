export function paginate(list: Array<any>, page: number, page_size = 10) {
    // 计算起始索引
    const start_index = (page - 1) * page_size;
    // 使用 slice 方法获取当前页数据
    const paginated_list = list.slice(start_index, start_index + page_size);
    return paginated_list;
}
