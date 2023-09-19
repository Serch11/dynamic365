export async function loadRecord(entityName: string, query: string, maxPageSice?: number, errorCalback?: (error: any) => void
): Promise<any> {
    try {
        const result: any = await Xrm.WebApi.Online.retriveMultipleRecord(entityName, query, maxPageSice);
        return result?.entities?.length >= 1 ? result.entities : null;
    } catch (e: any) {
        if (errorCalback != null) {
            errorCalback(e);
        }
        throw Error();
    }
}