import { $ } from "./utils.js";

// use $ to define a command or a list of commands
export const commands = {
    os_version: {
        "kernel": $({
            ifCommandExists: "uname",
            command: "uname -r",
            description:`
                Command: uname -r
                uname can print system information such as the kernel name and version, the operating system, the hostname…
                Try "uname -a" to print all available information or "uname --help" to learn more about this command
            `
        }),
        "distribution": $({
            ifCommandExists: "lsb_release",
            command: "lsb_release -a"
        }),
        "osx": $({
            ifCommandExists: "sw_vers",
            command: "sw_vers"
        })
    },
    "hardware": {
        "cpu_model": $([ // first that is valid
            {
                ifExists: "/proc/cpuinfo",
                command: "cat /proc/cpuinfo"
            },
            {
                ifCommandExists: "sysctl",
                command: "sysctl hw.model"
            }
        ])
    },
    "files": {
        "create_nested_directories": $({
            command: "mkdir -p a/b/c"
        }),
        "rename": {
            "file": $({
                command: "mv old_name.txt new_name.txt"
            }),
            "directory": $({
                command: "mv old_name new_name"
            }),
            "multiple_files": $({
                // TODO: check linux flags
                command: "rename -e 's/search/replace/' *.txt"
            })
        }
    }
};
