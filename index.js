const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: process.env.SERVER_IP,
        port: parseInt(process.env.SERVER_PORT),
        username: process.env.BOT_NAME || 'AfnanBot',
        version: false
    });

    bot.on('spawn', () => {
        console.log('🤖 Bot game me aa gaya hai aur pro player wali harkatein shuru kar raha hai!');
        startHumanizedBehavior(bot);
    });

    bot.on('end', (reason) => {
        console.log(`❌ Bot disconnect ho gaya: ${reason}. 30 seconds mein reconnect ho raha hai...`);
        setTimeout(createBot, 30000);
    });

    bot.on('error', (err) => {
        console.log('⚠️ Error aaya:', err);
    });
}

function startHumanizedBehavior(bot) {
    function loop() {
        if (!bot.entity) {
            setTimeout(loop, 5000);
            return;
        }

        // Ab isme walking, hitting, digging aur looking sab mix kar diya hai
        const actions = ['walk', 'hit', 'dig', 'look'];
        const chosenAction = actions[Math.floor(Math.random() * actions.length)];

        if (chosenAction === 'walk') {
            const directions = ['forward', 'back', 'left', 'right'];
            const chosenDir = directions[Math.floor(Math.random() * directions.length)];
            const walkDuration = Math.random() * 4000 + 2000; // 2 se 6 seconds chalna

            console.log(`🚶 Bot ${chosenDir} ki taraf chal raha hai...`);
            bot.setControlState(chosenDir, true);

            setTimeout(() => {
                bot.setControlState(chosenDir, false);
                setTimeout(loop, Math.random() * 6000 + 2000); // Rukne ka time
            }, walkDuration);

        } 
        else if (chosenAction === 'hit') {
            // Hawa me ya samne random punch marna (Swing arm)
            console.log('👊 Bot ne hawa me punch/hit kiya.');
            bot.swingArm('right');
            setTimeout(loop, Math.random() * 4000 + 2000);
        } 
        else if (chosenAction === 'dig') {
            // Bot ke aas-paas ya neeche ka block todne ki koshish karega
            try {
                const targetBlock = bot.blockAt(bot.entity.position.offset(1, 0, 0)) || 
                                    bot.blockAt(bot.entity.position.offset(0, -1, 0));
                
                if (targetBlock && targetBlock.name !== 'air' && targetBlock.name !== 'bedrock') {
                    console.log(`⛏️ Bot ${targetBlock.name} block todne ki koshish kar raha hai...`);
                    bot.lookAt(targetBlock.position.offset(0.5, 0.5, 0.5), true, () => {
                        bot.dig(targetBlock, (err) => {
                            if (err) {
                                // Agar block protected hai ya nahi toot sakta toh chupchap aage badh jayega
                                console.log('⚠️ Block nahi tod paya (Protected area).');
                            } else {
                                console.log('✅ Block successfully tod diya!');
                            }
                            setTimeout(loop, 3000);
                        });
                    });
                } else {
                    // Agar wahan block nahi mila toh normal punch marke aage badhega
                    bot.swingArm('right');
                    setTimeout(loop, 2000);
                }
            } catch (e) {
                setTimeout(loop, 3000);
            }
        } 
        else {
            // Idhar-udhar head ghumana
            const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2;
            const pitch = (Math.random() - 0.5) * 1;
            bot.look(yaw, pitch, true);
            console.log('👀 Bot ne idhar-udhar dekha.');
            setTimeout(loop, Math.random() * 4000 + 2000);
        }
    }

    setTimeout(loop, 4000);
}

createBot();
