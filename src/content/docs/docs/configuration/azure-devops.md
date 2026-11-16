---
title: "Azure DevOps"
description: "Set up an Azure DevOps observer in Barklarm to track your build pipeline from the system tray."
sidebar:
  order: 6
---

To get started, add a new observer in the [configuration window](/docs/application/configuration-window) and select the integration.

The Azure DevOps configuration requires:
- **Organization Url (Mandatory)**: url to the organization in azure devops or your TFS server.
- **Project (Mandatory)**: name of the project in azure devops.
- **Pipeline ID (Mandatory)**: number that represents the pipeline to track.
- **Authorization token (Mandatory)**: this is user access token to access the project.
- **Alias (Optional)**: A friendly name to display in the tray list.

There is also a **delete button** to remove this configuration from the list.