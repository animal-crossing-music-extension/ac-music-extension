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

    let contributorsTable = document.getElementById('contributors-table');
    let totalRows = Math.ceil(contributors.length / tableColCount);
    let rows = [];

    for (let i = 0; i < totalRows; i++) {
        rows.push(document.createElement('tr'));
    }

    rows.forEach((row, rowI) => {
        // Done in this funky way rather than just a forEach to easily create empty table columns to complete the table with an odd amount of contributors.
        for (let cI = rowI * tableColCount; cI < tableColCount + rowI * tableColCount; cI++) {
            let contributor = contributors[cI];
            let td = document.createElement('td');
            td.className = 'contributor';

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

                td.appendChild(avatar);
                td.appendChild(name);
                if (contributions) {
                    td.appendChild(document.createElement('br'));
                    td.appendChild(contributions);
                }
                if (githubLink) {
                    td.appendChild(document.createElement('br'));
                    td.appendChild(githubLink);
                }
                if (discordName) {
                    td.appendChild(document.createElement('br'));
                    td.appendChild(discordName);
                }
            }

            row.appendChild(td);
        }
        contributorsTable.appendChild(row);
    });
}