export const localAuthentication =  (levelRequired) =>{

    const existLevel = sessionStorage.getItem("level") || null;
    const token = sessionStorage.getItem("token") || null;
    
    return existLevel && existLevel <= levelRequired ? true : false ;
    
};