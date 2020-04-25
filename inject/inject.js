import bindings from "bindings";
import cp from "child_process";

const InjectAddon = bindings("inject");


export default function inject(string) {
    // save current tty settings
    const tty_settings = cp.execSync("stty -g", { stdio: ["inherit"] /* only stdin */});
    // disable printing of injected characters
    cp.execSync("stty -echo -icanon min 1 time 0", { stdio: "inherit"});
    // inject string via a native ioctl() call
    InjectAddon.inject(string);
    // restore tty settings
    cp.execSync(`stty "${tty_settings}"`, { stdio: "inherit"});
}

