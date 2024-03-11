const readline = require('readline');


const get_point = async (wallet, season) => {
    try {
        const result = await fetch(`${apiUrl}airdrop2/season${season}/points?address=${wallet}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },

            }
        )
        return await result.json()

    }
    catch (e) {
        console.log(e)
    }
}

const get_allowance = async (wallet) => {
    try {
        const result = await fetch(`${apiUrl}airdrop2/tip-allowance?address=${wallet}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },

            }
        )
        // return await result.json()
        return await result.json()



    }
    catch (e) {
        console.log(e)
    }
}

const option_process = async (choosing_number) => {
    let i = 1
    let tableResult = []
    let season = 0
    if (choosing_number == 1 || choosing_number == 2) {
        season = choosing_number
        let totalPoint = 0
        console.log(`\nRead Data Airdrop 2 Season ${season}... `)
        for (const wallet of walletAddress) {
            const getInfo = await get_point(wallet, season)
            if (getInfo[0] == null) {
                tableResult.push(
                    {
                        name: `Haven't Record Point`,
                        point: `-`
                    }
                )
            }
            else {
                totalPoint += parseInt(getInfo[0].points)

                tableResult.push(
                    {
                        name: getInfo[0].display_name,
                        point: getInfo[0].points
                    }
                )
            }
            i++
        }
        console.table(tableResult)
        console.log(`Total Degen point : ${totalPoint}`)
    }

    else if (choosing_number == 3) {
        console.log(`\nRead Data...`)
        for (const wallet of walletAddress) {
            i++
            const getInfo = await get_allowance(wallet)
            if (getInfo[0] == null) {
                tableResult.push(
                    {
                        name: `Have Record Point`,
                        rank: `-`,
                        tip_allowance: `-`,
                        remaining_allowance: `-`
                    }
                )
            }
            else {
                tableResult.push(
                    {
                        name: getInfo[0].display_name,
                        rank: getInfo[0].user_rank,
                        tip_allowance: getInfo[0].tip_allowance,
                        remaining_allowance: getInfo[0].remaining_allowance
                    })
            }
        }
        console.table(tableResult)
    }
}

function option_list() {
    const optionInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    optionInput.question(`Choose Feature : \n1. Check $DEGEN Airdrop 2 Season 1 points\n2. Check $DEGEN Airdrop 2 Season 2 points\n3. Check $DEGEN Airdrop 2 tip-allowance\n4. Exit\nInput your number : `, (choosing_number) => {
        if (choosing_number < 4 && choosing_number > 0) {
            option_process(choosing_number);
            return optionInput.close();
        }
        else if (choosing_number == 4) {
            return optionInput.close();
        } else {
            optionInput.close();
            console.log("Invalid input. Please enter a number between 1 and 3.\n");
            option_list(); // Prompt again if input is invalid
        }
    });
}

function info() {
    apiUrl = "https://www.degen.tips/api/"
    walletAddress = [
        //drop your wallet address
    ]
}

function main() {
    info()
    option_list()

}

main()
