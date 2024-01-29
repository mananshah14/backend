import { exec } from "child_process";
import { promisify } from "util";
// AWS Secret
const execPromise = promisify(exec);

const setAwsSecret = async (accessKeyId: string, secretAccessKey: string) => {
    const output = await execPromise(`kubectl create secret generic aws-secret -n crossplane-system --from-literal=aws_access_key_id=${accessKeyId} --from-literal=aws_secret_access_key=${secretAccessKey}`)
    if (!output.stderr) console.log(`Successfully created aws secret with name aws-secret in namespace crossplane-system `)
    else console.error(output.stderr)
}

export {
    setAwsSecret
}