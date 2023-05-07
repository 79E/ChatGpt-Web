export function formatTime (fmt = 'yyyy-MM-dd HH:mm:ss', timeDate?: Date) {
    const date = timeDate ? timeDate : new Date();
    const add0 = (num: number) => num < 10 ? `0${num}` : num;
    const o: {[key:string]: any} = {
        'yyyy': date.getFullYear(),
        'MM': add0(date.getMonth() + 1), //月份
        'dd': add0(date.getDate()), //日
        'HH': add0(date.getHours()), //小时
        'mm': add0(date.getMinutes()), //分
        'ss': add0(date.getSeconds()), //秒
        'qq': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds() //毫秒
    };

    Object.keys(o).forEach((i)=>{
        if(fmt.includes(i)){
            fmt = fmt?.replace(i, o[i]);
        }
    });

    return fmt;
}
