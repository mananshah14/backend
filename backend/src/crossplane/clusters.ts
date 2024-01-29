import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);

interface clusterConfig {
    name: string,
    region: string,
    version: string,
    nodeType: string,
    nodeGroup: string,
    nodeCount: number,
    minNodes: number,
    maxNodes: number
}

const createCluster = async (config: clusterConfig) => {
    const { name, maxNodes, minNodes, nodeCount, nodeGroup, nodeType, region, version } = config
    const output = await execPromise(`eksctl create cluster \
    --name ${name} \
    --region ${region} \
    --version ${version} \
    --node-type ${nodeType} \
    --nodegroup-name ${nodeGroup} \
    --nodes ${nodeCount} \
    --nodes-min ${minNodes} \
    --nodes-max ${maxNodes}  
    `)
    if (!output.stderr) console.log(`Successfully created the cluster ${name}:${version}`)
    else console.error(output.stderr)
}

export { createCluster }