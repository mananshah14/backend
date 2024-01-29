const API_VERSION = "pkg.crossplane.io/v1"
const AWS_API_VERSION = "aws.upbound.io/v1beta1"
const EKS_AWS_API_VERSION = "eks" + AWS_API_VERSION
const KIND_OPTIONS = {
    PROVIDER: 'Provider',
    PROVIDER_CONFIG: 'ProviderConfig',
    CLUSTER: 'Cluster',
    NODE_GROUP: 'NodeGroup'
}

export {
    API_VERSION,
    AWS_API_VERSION,
    EKS_AWS_API_VERSION,
    KIND_OPTIONS
}