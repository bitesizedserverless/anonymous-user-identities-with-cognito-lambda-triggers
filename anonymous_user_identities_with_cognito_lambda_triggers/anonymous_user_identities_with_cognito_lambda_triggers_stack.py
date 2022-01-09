"""Module for the main AnonymousUserIdentitiesWithCognitoLambdaTriggers Stack."""

# Third party imports
from aws_cdk import (
    core as cdk,
    aws_cognito as cognito,
    aws_iam as iam,
    aws_lambda as lambda_,
)

# Local application/library specific imports
from anonymous_user_identities_with_cognito_lambda_triggers.lambda_function import (
    LambdaFunction,
)


class AnonymousUserIdentitiesWithCognitoLambdaTriggersStack(cdk.Stack):
    """The AnonymousUserIdentitiesWithCognitoLambdaTriggers Stack."""

    def __init__(
        self,
        scope: cdk.Construct,
        construct_id: str,
        **kwargs,
    ) -> None:
        """Construct a new AnonymousUserIdentitiesWithCognitoLambdaTriggersStack."""
        super().__init__(scope, construct_id, **kwargs)

        # Create a userpool which requires an email address and verification
        user_pool_default = cognito.UserPool(
            scope=self,
            id="UserPool",
            self_sign_up_enabled=True,
            account_recovery=cognito.AccountRecovery.EMAIL_ONLY,
            sign_in_aliases=cognito.SignInAliases(
                email=True,
                phone=False,
                username=False,
            ),
            removal_policy=cdk.RemovalPolicy.DESTROY,
        )

        # Create a userpool which does not require an email address or verification
        user_pool_no_verify = cognito.UserPool(
            scope=self,
            id="UserPoolNoVerify",
            self_sign_up_enabled=True,
            account_recovery=cognito.AccountRecovery.NONE,
            sign_in_aliases=cognito.SignInAliases(
                email=False,
                phone=False,
                username=True,
            ),
            removal_policy=cdk.RemovalPolicy.DESTROY,
        )

        # Create a sign-up Lambda Function for the Pre Sign-Up Trigger
        pre_sign_up_lambda_function = LambdaFunction(
            scope=self,
            construct_id="PreSignUpLambda",
            code=lambda_.Code.from_asset("lambda_functions/pre_sign_up"),
        )

        # Allow the Lambda Function to be executed by the Cognito User Pool
        pre_sign_up_lambda_function.function.add_permission(
            scope=self,
            id="CognitoLambdaPermission",
            action="lambda:InvokeFunction",
            principal=iam.ServicePrincipal(service="cognito-idp.amazonaws.com"),
            source_arn=user_pool_no_verify.user_pool_arn,
        )

        # Add the Lambda Function as a Pre Sign-Up Trigger
        cfn_user_pool: cognito.CfnUserPool = user_pool_no_verify.node.default_child
        cfn_user_pool.lambda_config = cognito.CfnUserPool.LambdaConfigProperty(
            pre_sign_up=pre_sign_up_lambda_function.function.function_arn
        )

        # Add a client to the default user pool
        cognito.UserPoolClient(
            scope=self,
            id="UserPoolClient",
            user_pool=user_pool_default,
            supported_identity_providers=[
                cognito.UserPoolClientIdentityProvider.COGNITO
            ],
            o_auth=cognito.OAuthSettings(
                flows=cognito.OAuthFlows(
                    client_credentials=False,
                    authorization_code_grant=True,
                    implicit_code_grant=False,
                ),
                scopes=[cognito.OAuthScope.PROFILE],
            ),
            auth_flows=cognito.AuthFlow(
                user_srp=True,
                user_password=True,
            ),
            generate_secret=False,
        )

        # Add a client to the no-verify user pool
        cognito.UserPoolClient(
            scope=self,
            id="UserPoolNoVerifyClient",
            user_pool=user_pool_no_verify,
            supported_identity_providers=[
                cognito.UserPoolClientIdentityProvider.COGNITO
            ],
            o_auth=cognito.OAuthSettings(
                flows=cognito.OAuthFlows(
                    client_credentials=False,
                    authorization_code_grant=True,
                    implicit_code_grant=False,
                ),
                scopes=[cognito.OAuthScope.PROFILE],
            ),
            auth_flows=cognito.AuthFlow(
                user_srp=True,
                user_password=True,
            ),
            generate_secret=False,
        )
