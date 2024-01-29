import { exec } from "child_process";
import { promisify } from "util";
import { API_VERSION, AWS_API_VERSION, EKS_AWS_API_VERSION, KIND_OPTIONS } from "./constant";
import { parseTableDataToJson } from "src/utils";
const execPromise = promisify(exec);

// Eg. name: provider-aws-s3, version: v0.47.0
const installProvider = async (name: string = "default", version: string) => {
    const output = await execPromise(`cat <<EOF | kubectl apply -f -
        apiVersion: ${API_VERSION}
        kind: ${KIND_OPTIONS.PROVIDER}
        metadata:
            name: ${name}
        spec:
            package: xpkg.upbound.io/upbound/${name}:${version}
        EOF
    `)
    if (!output.stderr) console.log(`Successfully installed the provider ${name}:${version}`)
    else console.error(output.stderr)
}

// Eg. name: "default", secretName: "aws-secret", secretKey: "creds"
const createProviderConfig = async (name: string = "default", secretName: string, secretKey: string) => {
    const output = await execPromise(`cat <<EOF | kubectl apply -f -
        apiVersion: ${AWS_API_VERSION}
        kind: ${KIND_OPTIONS.PROVIDER_CONFIG}
        metadata:
            name: ${name}
        spec:
            credentials:
                source: Secret
                secretRef:
                    namespace: crossplane-system
                    name: ${secretName}
                    key: ${secretKey}
        EOF
    `)
    if (!output.stderr) console.log(`Successfully created the provider config for ${name}`)
    else console.error(output.stderr)
}

// Eg. name: "sample-cluster", providerRefName: "default", region: "us-west-1"
const createCluster = async (name: string = "default", providerRefName: string, region: string) => {
    const output = await execPromise(`cat <<EOF | kubectl apply -f -
        apiVersion: ${EKS_AWS_API_VERSION}
        kind: ${KIND_OPTIONS.CLUSTER}
        metadata:
            name: ${name}
        spec:
            forProvider:
                region: ${region}
            providerConfigRef:
                name: ${providerRefName}
        EOF
    `)
    if (!output.stderr) {
        console.log(`Successfully created a cluster with name ${name}`)
        const ngOutput = await execPromise(`cat <<EOF | kubectl apply -f -
            apiVersion: ${EKS_AWS_API_VERSION}
            kind: ${KIND_OPTIONS.NODE_GROUP}
            metadata:
                name: ${name}-ng
            spec:
                forProvider:
                    clusterNameRef:
                        name: ${name}
                    region: ${region}
                    scalingConfig:
                        - desiredSize: 1
                        maxSize: 1
                        minSize: 1
            EOF
        `)
        if (!ngOutput.stderr) console.log(`Successfully created a nodegroup with name ${name}-ng`)
        else console.error(ngOutput.stderr)
    } else console.error(output.stderr)
}

const getProviderHealth = async (name: string) => {
    const output = await execPromise(`kubectl get providers -l ${name}`)
    if (output.stderr) {
        console.error(output.stderr)
        return
    }
    else {
        return parseTableDataToJson(output.stdout);
    }
}

export {
    installProvider, 
    createProviderConfig,
    createCluster,
    getProviderHealth
}