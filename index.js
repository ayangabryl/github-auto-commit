import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import moment from "moment";

const path = "./data.json";

// Configuration
const MIN_COMMITS = 4;  // Updated minimum commits
const MAX_COMMITS = 14; // Updated maximum commits
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 23;
const SKIP_PROBABILITY = 1 / 7;

const COMMIT_MESSAGES = [
    "update: daily progress",
    "feat: add new content",
    "chore: routine update",
    "docs: update documentation",
    "style: format content",
    "fix: minor corrections",
    "refactor: improve structure"
];

const getRandomTime = () => {
    const hour = Math.floor(Math.random() * (WORK_END_HOUR - WORK_START_HOUR + 1)) + WORK_START_HOUR;
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    return moment()
        .hour(hour)
        .minute(minute)
        .second(second)
        .format();
};

const getCommitMessage = () => {
    const message = COMMIT_MESSAGES[Math.floor(Math.random() * COMMIT_MESSAGES.length)];
    return `${message} #${Math.floor(Math.random() * 1000)}`;
};

const makeCommit = async (commitNumber) => {
    const commitTime = getRandomTime();
    const data = {
        timestamp: commitTime,
        commitNumber: commitNumber,
        updateId: Math.random().toString(36).substring(7)
    };

    await jsonfile.writeFile(path, data);
    await simpleGit().add([path]).commit(getCommitMessage(), {"--date": commitTime});
};

const runDailyCommits = async () => {
    try {
        // Skip weekends
        const today = moment().isoWeekday(); // 1 for Monday, 7 for Sunday
        if (today === 6 || today === 7) {
            console.log("Skipping commits today - it's the weekend!");
            return;
        }

        if (Math.random() < SKIP_PROBABILITY) {
            console.log("Skipping commits today");
            return;
        }

        // Configure git
        const git = simpleGit();
        await git.addConfig('user.name', 'ayangabryl');
        await git.addConfig('user.email', 'iangabrielagujitas@gmail.com');

        // Generate random number of commits for today (5-32)
        const numCommits = Math.floor(Math.random() * (MAX_COMMITS - MIN_COMMITS + 1)) + MIN_COMMITS;
        console.log(`Making ${numCommits} commits for today`);

        // Make the commits
        for (let i = 1; i <= numCommits; i++) {
            await makeCommit(i);
            // Add small random delay between commits (0.5-2 seconds)
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));
        }

        // Push all commits
        await git.push();
        console.log('Successfully pushed all commits');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Run the script
runDailyCommits();