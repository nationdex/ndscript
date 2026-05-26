export class NDScriptInstaller {

    static installed: boolean = false

    static version: string = "0.1.0-alpha"

    static async install() {

        if (this.installed) {

            return {

                success: false,

                message:
                    "NDScript is already installed"

            }

        }

        const logs: string[] = []

        logs.push(
            "[NDScript Installer] Starting installation..."
        )

        logs.push(
            "[NDScript Installer] Loading parser..."
        )

        logs.push(
            "[NDScript Installer] Loading runtime..."
        )

        logs.push(
            "[NDScript Installer] Loading commands..."
        )

        logs.push(
            "[NDScript Installer] Registering NDScript..."
        )

        this.installed = true

        logs.push(
            `[NDScript Installer] Installed successfully (v${this.version})`
        )

        return {

            success: true,

            logs

        }

    }

    static async uninstall() {

        if (!this.installed) {

            return {

                success: false,

                message:
                    "NDScript is not installed"

            }

        }

        const logs: string[] = []

        logs.push(
            "[NDScript Installer] Uninstalling NDScript..."
        )

        logs.push(
            "[NDScript Installer] Removing runtime..."
        )

        logs.push(
            "[NDScript Installer] Removing commands..."
        )

        logs.push(
            "[NDScript Installer] Cleaning cache..."
        )

        this.installed = false

        logs.push(
            "[NDScript Installer] Uninstalled successfully"
        )

        return {

            success: true,

            logs

        }

    }

    static async update() {

        if (!this.installed) {

            return {

                success: false,

                message:
                    "NDScript is not installed"

            }

        }

        const logs: string[] = []

        logs.push(
            "[NDScript Installer] Checking for updates..."
        )

        logs.push(
            "[NDScript Installer] Updating runtime..."
        )

        logs.push(
            "[NDScript Installer] Updating commands..."
        )

        logs.push(
            `[NDScript Installer] Updated successfully (v${this.version})`
        )

        return {

            success: true,

            logs

        }

    }

}
