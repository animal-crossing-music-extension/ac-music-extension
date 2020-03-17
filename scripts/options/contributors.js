// Be sure to update this URL when the time comes.
const projectURL = 'https://acmusicext.com/api/contributors';
const tableColCount = 5;

function getContributors() {
    return new Promise(resolve => {
        let request = new XMLHttpRequest();
        request.open('GET', projectURL, true);

        request.onload = function () {
            if (this.status == 200 || this.status == 304) {
                try {
                    let data = JSON.parse(request.response);
                    resolve(data);
                } catch (e) {
                    error();
                }
            } else error();
        };

        request.onerror = error
        request.send();

        function error() {
            resolve({
                error: true
            });
        }
    });
}

async function updateContributors() {
    let contributors = await getContributors();

    if (contributors.error) {
        document.getElementById('contributors-failed').style.display = 'unset';
        return;
    }

    let contributorsContainer = document.getElementById('contributors-container');


    contributors.forEach((contributor) => {
        let div = document.createElement('div');
        div.className = 'contributor';

        if (contributor) {
            let avatar = document.createElement('img');
            avatar.src = contributor.avatar_url;

            let name = document.createElement('p');
            name.textContent = contributor.name;

            let contributions;
            if (contributor.contributions > 0) {
                contributions = document.createElement('span');
                contributions.textContent = `${contributor.contributions} ${(contributor.contributions == 1) ? 'Contribution' : 'Contributions'}`;
            }

            let githubLink;
            if (contributor.url) {
                githubLink = document.createElement('a');
                githubLink.target = "_blank";
                githubLink.href = contributor.url;
                githubLink.className = 'contributorLink';

                let icon = document.createElement('img');
                icon.src = 'img/social/github.png';
                icon.className = 'githubIcon';
                githubLink.appendChild(icon);

                githubLink.append(`@${contributor.login}`);
            }

            let discordName;
            if (contributor.discord) {
                discordName = document.createElement('span');
                discordName.className = 'contributorLink';

                let icon = document.createElement('img');
                icon.src = 'img/social/discord.png';
                icon.className = 'discordIcon';
                discordName.appendChild(icon);

                discordName.append(`@${contributor.discord}`);
            }

            div.appendChild(avatar);
            div.appendChild(name);
            if (contributions) {
                div.appendChild(document.createElement('br'));
                div.appendChild(contributions);
            }
            if (githubLink) {
                div.appendChild(document.createElement('br'));
                div.appendChild(githubLink);
            }
            if (discordName) {
                div.appendChild(document.createElement('br'));
                div.appendChild(discordName);
            }
        }
        contributorsContainer.appendChild(div);
    });
}