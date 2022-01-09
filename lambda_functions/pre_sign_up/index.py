import json


def event_handler(event, _context):
    print(json.dumps(event))

    event["response"]["autoConfirmUser"] = True
    return event
