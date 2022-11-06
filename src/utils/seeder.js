const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') })
const mongoose = require('mongoose');

const User = require('../models/user');
const Account  = require('../models/account');
const Wallet = require('../models/wallet');
const Credit = require('../models/credit');
const Category = require('../models/category');
const Job = require('../models/job');
const PointHistory = require('../models/pointHistory');
const { connectDatabase } = require('../config/database');
const { userStatus } = require('../config/userStatus');
const { roles } = require('../config/roles');
const { adminEmail, systemAdminEmail } = require('../config/constants');

connectDatabase();

const designCategoryId = new mongoose.Types.ObjectId();
const developmentCategoryId = new mongoose.Types.ObjectId();
const webDevelopmentCategoryId = new mongoose.Types.ObjectId();
const designUiuxCategoryId = new mongoose.Types.ObjectId();

const credits = [
    {
        name: '100 Points',
        price: 100,
        points: 100
    },
    {
        name: '200 Points',
        price: 200,
        points: 200
    },
    {
        name: '500 Points',
        price: 500,
        points: 500
    },
    {
        name: '1000 Points',
        price: 1000,
        points: 1000
    }
];

const categories = [
    {
        _id: designCategoryId,
        name: 'Design',
        children: [
            designUiuxCategoryId
        ]
    },
    {
        _id: developmentCategoryId,
        name: 'Development',
        children: [
            webDevelopmentCategoryId
        ]
    },
    {
        _id: webDevelopmentCategoryId,
        name: 'Web development',
        parent: developmentCategoryId
    },
    {
        _id: designUiuxCategoryId,
        name: 'Design UI/UX',
        parent: designCategoryId
    }
];

const seedCredits = async () => {
    try {
        await Credit.deleteMany();
        console.log('Credits are deleted');

        await Credit.insertMany(credits);
        console.log('Inserted credits');
    } catch (error) {
        console.log(error.message);
    }
};

const seedUsers = async () => {
    try {
        await User.deleteMany();
        console.log('Users are deleted');

        await Account.deleteMany();
        console.log('Accounts are deleted');

        const employer = {
            name: 'employer',
            email: 'employer@gmail.com',
            phone: '01238139295',
            status: userStatus.ACTIVE,
            roles: [
                roles.EMPLOYER,
                roles.FREELANCER
            ],
            gender: 'Male',
            address: 'TD',
            city: 'HCM',
            country: 'VN',
            identityNumber: '0686868686868686',
            company: 'HCMUTE',
            companyRole: 'Student'
        };

        const freelancer = {
            name: 'freelancer',
            email: 'freelancer@gmail.com',
            phone: '01238139295',
            status: userStatus.ACTIVE,
            gender: 'Male',
            address: 'BT',
            city: 'HCM',
            country: 'VN',
            identityNumber: '0132132132132',
            experience: '3 years in software development',
            introduction: 'I am a senior software engineer'
        };

        const admin = {
            name: 'admin',
            email: adminEmail,
            phone: '0910301031849',
            roles: [
                roles.ADMIN
            ],
            status: userStatus.ACTIVE
        };


        const systemAdmin = {
            name: 'system admin',
            email: systemAdminEmail,
            phone: '0213032490',
            roles: [
                roles.ADMIN
            ],
            status: userStatus.ACTIVE
        }

        await User.deleteMany();
        console.log("Deleted users");

        const ad = await User.create(admin);
        const free = await User.create(freelancer);
        const empl = await User.create(employer);
        const sysAd = await User.create(systemAdmin);

        const systemAdminAccount = {
            user: sysAd.id,
            password: '123456',
            emailConfirmed: true
        }

        const employerAccount = {
            user: empl.id,
            password: '123456',
            emailConfirmed: true
        }

        const freelancerAccount = {
            user: free.id,
            password: '123456',
            emailConfirmed: true
        }

        const adminAccount = {
            user: ad.id,
            password: '123456',
            emailConfirmed: true
        }

        
        
        await Account.deleteMany();
        console.log("Deleted accounts");
        await Wallet.deleteMany();
        console.log("Deleted wallets");

        await Account.create(employerAccount);
        await Account.create(freelancerAccount);
        await Account.create(adminAccount);
        await Account.create(systemAdminAccount);
        await Wallet.create({ user: empl.id });
        await Wallet.create({ user: free.id });
        await Wallet.create({ user: ad.id });
        const systemAdminWallet = await Wallet.create({ user: sysAd.id });

        await PointHistory.create({ wallet: systemAdminWallet.id, sender: empl.id, point: 40, month: 'November' });
        await PointHistory.create({ wallet: systemAdminWallet.id, sender: empl.id, point: 50, month: 'November' });

        console.log('Created 3 users with 3 accounts, 3 wallets');

        const jobs = [
            {
                name: 'Demo job 1',
                description: 'Demo with text .............................................................................',
                minPrice: 100,
                maxPrice: 200,
                category: webDevelopmentCategoryId,
                owner: empl.id,
                startDate: '10/20/2022',
                endDate: '12/12/2022'
            },
            {
                name: 'Demo job 2',
                description: 'Ullamco in consectetur exercitation ad consectetur consectetur deserunt Lorem reprehenderit excepteur do et ad. Ullamco anim aliquip elit adipisicing commodo ea anim amet dolore cillum enim amet dolor ad. Id eiusmod ullamco esse quis cupidatat ipsum in culpa. Officia cupidatat ut ea aute nisi Lorem nostrud commodo ullamco in tempor culpa. Elit aliquip non occaecat ea voluptate ipsum cupidatat anim ipsum minim commodo excepteur commodo.',
                minPrice: 300,
                maxPrice: 500,
                category: webDevelopmentCategoryId,
                owner: empl.id,
                startDate: '10/25/2022',
                endDate: '12/12/2022'
            },
            {
                name: 'Demo job 3',
                description: 'Ullamco tempor culpa proident minim pariatur. Amet dolor sit esse veniam aute irure enim ipsum. Deserunt magna sit adipisicing culpa nisi minim qui incididunt nostrud cillum in. Magna anim Lorem consectetur sunt sint amet pariatur amet voluptate consectetur et elit. Nulla aliqua tempor nulla et minim exercitation elit nulla esse. Amet consectetur aliquip fugiat ut voluptate culpa laborum dolore deserunt occaecat officia aute in deserunt. Quis tempor non aute nostrud incididunt fugiat dolor velit consequat. Quis cillum magna amet magna exercitation fugiat laboris sint magna laborum dolor amet. Non in consectetur labore laboris consequat. Qui nulla elit pariatur commodo sit voluptate sit minim esse. Tempor ex cillum consectetur magna incididunt do ad irure. Irure nulla amet duis ipsum culpa dolor mollit ipsum tempor adipisicing est.',
                minPrice: 200,
                maxPrice: 600,
                category: designUiuxCategoryId,
                owner: empl.id,
                startDate: '10/25/2022',
                endDate: '12/12/2022'
            },
            {
                name: 'Demo job 4',
                description: 'JMagna exercitation ipsum laboris voluptate est aute excepteur officia consequat magna mollit ipsum velit. Dolor amet occaecat duis et officia non deserunt amet eu excepteur magna est est. Labore id exercitation id ad deserunt. Fugiat nostrud ut cillum laboris anim eu enim ad consequat amet nostrud amet amet laborum. Esse ullamco duis ex consequat irure esse.',
                minPrice: 300,
                maxPrice: 500,
                category: designUiuxCategoryId,
                owner: empl.id,
                startDate: '10/25/2022',
                endDate: '12/12/2022'
            },
            {
                name: 'Demo job 5',
                description: 'Incididunt et magna deserunt amet culpa mollit mollit. Enim irure officia nostrud do do magna excepteur velit dolor proident. Deserunt duis est nostrud proident ex dolore fugiat duis velit dolore. Pariatur pariatur ex adipisicing aliquip nostrud do aliquip do laboris nisi consequat. Mollit anim magna voluptate ullamco aliquip labore in excepteur aliquip consectetur. Dolore nisi Lorem ad fugiat commodo consectetur non minim consectetur enim et id consequat.',
                minPrice: 500,
                maxPrice: 1000,
                category: webDevelopmentCategoryId,
                owner: empl.id,
                startDate: '10/25/2022',
                endDate: '12/12/2022'
            }
        ];

        await Job.deleteMany();
        console.log("Deleted jobs");
        await Job.insertMany(jobs);
        console.log("added jobs");

    } catch (error) {
        console.log(error.message);
    }
};

const seedCategories = async () => {
    try {
        await Category.deleteMany();
        console.log('Categories are deleted');

        await Category.insertMany(categories);
        console.log('Inserted categories');
    } catch (error) {
        console.log(error.message);
    }
};


const seedData = async () => {
    try {
        await seedCredits();
        await seedUsers();
        await seedCategories();

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
};

seedData();