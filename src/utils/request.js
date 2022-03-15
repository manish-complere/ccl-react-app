const BASE_URL = "http://127.0.0.1:5000/api"

const request = async (args) => {
    const { URL = "", requestOptions = {} } = args || {}
    try {
        const response = await fetch(`${BASE_URL}${URL}`, requestOptions);
        return response
    } catch (e) {
        console.log(e)
    }


}

export default request;