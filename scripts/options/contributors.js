// Be sure to update this URL when the time comes.
const projectURL = 'https://api.github.com/repos/PikaDude/ac-music-extension-revived/contributors';
const tableColCount = 6;

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

            if (contributor) {
                let anchor = document.createElement('a');
                anchor.target = "_blank";
                anchor.href = contributor.html_url;
                anchor.className = 'contributor';

                let avatar = document.createElement('img');
                avatar.src = contributor.avatar_url;

                let name = document.createElement('p');
                name.textContent = contributor.login;

                anchor.appendChild(avatar);
                anchor.appendChild(name);
                td.appendChild(anchor);
            }

            row.appendChild(td);
        }
        contributorsTable.appendChild(row);
    });
}