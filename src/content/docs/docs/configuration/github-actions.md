---
title: "GitHub Actions"
description: "Monitor a GitHub Actions workflow in Barklarm and get desktop notifications when its status changes."
sidebar:
  order: 1
---

To get started, add a new observer in the [configuration window](/docs/application/configuration-window) and select the integration.

The GitHub configuration requires:

* **Owner (Mandatory)**: GitHub handle of the user or organization the project belongs to.
* **Repo (Mandatory)**: name of the repository that the pipeline belongs to.
* **Workflow Name (Mandatory)**: name of the pipeline file that is used to track the build.
* **Authorization token (Mandatory)**: this is a personal access token used to access the project.
* **Alias (Optional)**: A friendly name to display in the tray list.

There is also a **delete button** to remove this configuration from the list.