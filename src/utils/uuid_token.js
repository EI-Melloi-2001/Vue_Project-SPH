import{ v4 as uuidv4 } from 'uuid';
//封装函数：只能生成一次用户临时身份
//要生成一个随机字符串，且每次执行不能发生变化，游客身份持久存储。
export const getUUID = () => {
    //先从本地存储获取uuid（看一下本地存储里是否有）
    let uuid_token = localStorage.getItem('UUIDTOKEN');
    //如果没有
    if(!uuid_token){
        //就生成一个游客临时身份
        uuid_token = uuidv4();
        //本地存储只存储一次
        localStorage.setItem('UUIDTOKEN',uuid_token);
    }
    //切记要有返回值，没有返回值undefined
    return uuid_token;
}