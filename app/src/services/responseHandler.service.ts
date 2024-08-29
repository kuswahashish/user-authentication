import { msg } from "../../constants/en";

const sendResponse = async (
    req: any,
    res: any,
    statusCode: number,
    message?: any,
    data?: any,
    pagination?: any,
    errorMessages?: any
) => {
    try {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        // Build response object conditionally
        const responseObj: { [key: string]: any } = {};

        if (message) {
            responseObj.message = message;
        }

        if (data) {
            responseObj.data = statusCode === 500 ? data.message : data;
        }

        if (pagination) {
            responseObj.pagination = pagination;
        }

        if (errorMessages) {
            responseObj.errorMessages = errorMessages;
        }

        res.write(
            JSON.stringify(responseObj)
        );
        res.end();
    } catch (err) {
        console.log("Error(sendResponse): ", err);
        throw err;
    }
};


const handleInternalError = (error: any, next: any) => {
    const err: any = new Error(error);
    err.httpStatusCode = 500;
    err.msg = msg.commonErrorCatch;
    return next(err);
};

const respondWithSuccessData = (res: any, status: any, message: any, data: any) => {
    return res.status(status).json({
        status,
        message,
        data,
    });
};

function respondWithSuccessNoData(res: any, status: any, message: any) {
    return res.status(status).json({
        status,
        message,
    });
}

const respondWithValidationFailed = (res: any, status: any, message: any, errorMessages: any) => {
    return res.status(status).json({
        status,
        message,
        errorMessages,
    });
};

const respondWithFailed = (res: any, status: any, message: any) => {
    return res.status(status).json({
        status,
        message,
    });
};

const respondWithFailedData = (res: any, status: any, message: any, data: any) => {
    return res.status(status).json({
        status,
        message,
        data,
    });
};

const respondWithPagination = (
    res: any,
    statusCode: any,
    message: any,
    data: any,
    count: any,
    pageNo: any,
    totalRecord: any
) => {
    const itemsPerPage = data.length;
    const lastPage = Math.ceil(count / totalRecord);

    const response = {
        status: statusCode,
        message: message,
        data: data,
        pagination: {
            total: count,
            itemsPerPage: totalRecord,
            page: pageNo,
            lastPage: lastPage,
        },
    };
    return res.status(statusCode).json(response);
};

export const responseHandler = {
    handleInternalError,
    respondWithSuccessData,
    respondWithValidationFailed,
    respondWithSuccessNoData,
    respondWithFailed,
    respondWithFailedData,
    respondWithPagination,
    sendResponse
};
