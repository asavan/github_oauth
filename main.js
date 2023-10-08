function addGreet(user) {
    if (!user.login) {
        return;
    }
    const header = document.createElement("h1");
    const text = "Привет, " + user.login;
    header.textContent = text;
    document.body.appendChild(header);
}

function main() {
    const cid = "ef25160563172c2b50ad";
    const secret_state = "alco";

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    if (!code) {
        const pre_params = {
            client_id: cid,
            state: secret_state
        };
        const scope = urlParams.get("scope");
        if (scope) {
            pre_params.scope = scope;
        }

        const params = new URLSearchParams(pre_params);
        window.location.href = "https://github.com/login/oauth/authorize?" + params.toString();
    } else {
        const state = urlParams.get("state");
        if (state !== secret_state) {
            console.log("Bad state");
            return false;
        }
        const tokenUrl = "https://abrasive-wave-soda.glitch.me/update";
        const tokenParams = {
            code: code,
            state: secret_state
        };
        const params = new URLSearchParams(tokenParams);
        const fullUrl = tokenUrl + "?" + params.toString();
        console.log(fullUrl);
        fetch(fullUrl).then(response => response.json())
            .then(data => {
                console.log(data);
                addGreet(data);
                window.history.replaceState({}, document.title, "./");
            });
    }
}
main();
