const { Telegraf } = require('telegraf');
const { PrismaClient } = require('@prisma/client');

const bot = new Telegraf('6755831347:AAEP7L7CLmYhygSj0ApG6UkWtRpIWiGvPGA');
const prisma = new PrismaClient();

bot.start((ctx) => ctx.reply('Olá! Eu sou o seu bot de atendimento. Como posso ajudar?'));

bot.on('text', async (ctx) => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const userMessage = ctx.message.text;

    if (currentHour >= 9 && currentHour < 14) {
        await ctx.reply('O horário de funcionamento da empresa é das 09:00 às 14:00. Por favor, visite o link: https://faesa.br');
    } else {
        await ctx.reply('O horário de funcionamento da empresa é das 09:00 às 14:00. Por favor, deixe seu e-mail para que possamos entrar em contato.');
        
        const userEmail = userMessage.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
        if (userEmail && userEmail.length > 0) {
            try {
                await prisma.user.create({
                    data: {
                        email: userEmail[0]
                    }
                });
                await ctx.reply('Seu e-mail foi registrado com sucesso. Entraremos em contato em breve.');
            } catch (error) {
                console.error('Erro ao armazenar o e-mail:', error);
                await ctx.reply('Ocorreu um erro ao registrar seu e-mail. Por favor, tente novamente mais tarde.');
            }
        } else {
            await ctx.reply('Por favor, forneça um e-mail válido.');
        }
    }
});

bot.launch();
console.log('Bot is running...');
