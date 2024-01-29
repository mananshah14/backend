export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function parseTableDataToJson(dataStr: string) {

    // Split the input string into lines and extract the header and data rows
    const lines = dataStr.trim().split('\n');
    const header = lines[0]?.trim().split(/\s{2,}/);
    const data = lines.slice(1).map(line => line.trim().split(/\s{2,}/));

    // Create an array of objects where each object represents a row of data
    return data.map(row => header && Object.fromEntries(header.map((key, index) => [key, row[index]])))
}