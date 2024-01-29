import { exec } from "child_process";
import { promisify } from "util";
import { sleep } from "src/utils";
const execPromise = promisify(exec);

const installCrossplane = async () => {
    try {
        // 1) First check if "kubectl" is a command found or not
        await execPromise("kubectl version");

        // 2) if yes then run kubectl cluster-info to check if Kubernetes control plane is running or not
        await execPromise("kubectl cluster-info");

        // 3) check if "helm" is a command found or not
        await execPromise("helm version");

        const { stderr: crossplanInstallationDetails } = await execPromise("kubectl get pods -n crossplane-system");
        if (crossplanInstallationDetails.trim() === "No resources found in crossplane-system namespace.") {
            // 4) if Helm found then run the below commands to set up Crossplane
            await execPromise("helm repo add crossplane-stable https://charts.crossplane.io/stable");
            await execPromise("helm repo update");
            const installDetails = await execPromise("helm install crossplane crossplane-stable/crossplane --namespace crossplane-system --create-namespace");

            // 5) verify if Crossplane installed by running the following command: kubectl get pods -n crossplane-system
            new Promise(async (res, rej) => {
                let verificationOutput = ''
                let countIndex = 0
                do {
                    countIndex += 1
                    await sleep(1000)
                    const { stdout } = await execPromise("kubectl get pods -n crossplane-system");
                    verificationOutput = stdout
                } while (countIndex < 30 && verificationOutput.startsWith("NAME") && verificationOutput.includes("Init"));
                if (verificationOutput.startsWith("NAME") && verificationOutput.includes("Running")) return res('Success')
                else return rej('Error')
            }).then(() => {
                console.log("Crossplane up and running now. You can check by running the following command: `kubectl get pods -n crossplane-system`")
            }).catch(() => {
                console.error("Crossplane didn't run within 30 seconds. Please check its status by running the following command: `kubectl get pods -n crossplane-system`")
            })
            if (!installDetails.stderr) return "Crossplane installed successfully.";
            else {
                throw new Error("Error verifying Crossplane installation. Please check the installation status using 'kubectl get pods -n crossplane-system' and try again.");
            }
        } else {
            return "Crossplane already installed."
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error: ${error.message}`);
        }
        return 
    }
};

const runInstallation = async () => {
    return installCrossplane()
};

export default runInstallation;
