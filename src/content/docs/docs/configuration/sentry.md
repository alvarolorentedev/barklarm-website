---
title: "Sentry"
description: "Connect a Sentry project to Barklarm and monitor its status from the system tray."
sidebar:
  order: 4
---

To get started, add a new observer in the [configuration window](/docs/application/configuration-window) and select the integration.

The Sentry configuration requires:
- **Organization (Mandatory)**: sentry organization handle.
- **Project (Mandatory)**: name of the project that the issues belongs to.
- **Authorization token (Mandatory)**: this is user access token to access the project.
- **Alias (Optional)**: A friendly name to display in the tray list.

There is also a **delete button** to remove this configuration from the list.