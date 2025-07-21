class ApiResponse{
    static success(message: string, data?: any){
        return {success: true, message, data}
    }

    static error(message: string, data?: any) {
        return { success: false, message, data }
    }
}

export default ApiResponse