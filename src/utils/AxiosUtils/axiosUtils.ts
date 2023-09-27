export default class AxiosUtils {
  static axiosConfigConstructor = (method: string, endpoint: string, data: any, headers?: any, params?: any) => {
    return {
      method: method,
      url: endpoint,
      headers: {
        ...headers,
      },
      data: data,
      params: params,
    };
  };
}
