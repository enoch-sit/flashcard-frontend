#!/usr/bin/env python3
# Slightly modified version of test_flashcard_api.py for Docker environment

import requests
import json
import time
import os
import getpass
from datetime import datetime
import webbrowser
import random
import string
import argparse
import sys
import re
import socket

# Parse command-line arguments with Docker-optimized defaults
parser = argparse.ArgumentParser(
    description="Test the Flashcard API in Docker environment"
)
parser.add_argument(
    "--port", type=int, default=3001, help="API server port (default: 3001)"
)
parser.add_argument(
    "--mailhog-port", type=int, default=8025, help="MailHog web UI port (default: 8025)"
)
parser.add_argument(
    "--mailhog-host",
    type=str,
    default="mailhog",
    help="MailHog host (default: mailhog for Docker network)",
)
parser.add_argument(
    "--api-host",
    type=str,
    default="api",
    help="API host (default: api for Docker network)",
)
parser.add_argument(
    "--wait-email",
    type=int,
    default=5,
    help="Time to wait for emails to arrive in seconds (default: 5)",
)
parser.add_argument(
    "--auto", action="store_true", help="Run in automated mode with minimal user input"
)
parser.add_argument(
    "--auto-verify",
    action="store_true",
    help="Automatically extract verification token from MailHog (requires --auto)",
)
args = parser.parse_args()

# Configuration for Docker environment
BASE_URL = f"http://{args.api_host}:{args.port}"
MAILHOG_URL = f"http://{args.mailhog_host}:{args.mailhog_port}"
MAILHOG_API_URL = f"http://{args.mailhog_host}:{args.mailhog_port}/api/v2/messages"
print(f"Using API at {BASE_URL}")
print(f"Using MailHog at {MAILHOG_URL}")

# Rest of the test script remains the same as your original file
# ... (insert the rest of your test_flashcard_api.py here)
