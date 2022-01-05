#!/usr/bin/env python3
"""The main app. Contains all the stacks."""

# Standard library imports
# -

# Third party imports
# -

# Local application/library specific imports
from aws_cdk import core as cdk
from anonymous_user_identities_with_cognito_lambda_triggers.anonymous_user_identities_with_cognito_lambda_triggers_stack import (
    AnonymousUserIdentitiesWithCognitoLambdaTriggersStack,
)

app = cdk.App()
AnonymousUserIdentitiesWithCognitoLambdaTriggersStack(
    scope=app,
    construct_id="AnonymousUserIdentitiesWithCognitoLambdaTriggersStack",
)

app.synth()
