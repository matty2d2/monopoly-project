# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Property.delete_all
Player.delete_all


red_circle_url = 'https://www.emoji.co.uk/files/apple-emojis/symbols-ios/956-large-red-circle.png';
blue_circle_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Circle-blue.svg/512px-Circle-blue.svg.png';

############## PLAYERS #######################
the_bank = Player.create(name: 'The Bank')
player1 = Player.create(name: 'Abdullah', cash: 1500, piece: red_circle_url, currently_on: 1)
player2 = Player.create(name: 'Matt', cash: 1500, piece: blue_circle_url, currently_on: 1)

############## PROPERTIES #######################
go = Property.create(name: 'Go', player: the_bank)
old_kent_road = Property.create(name: 'Old Kent Road', set: 'Brown', price: 60, rent: 2, mortgage_val: 30, player: the_bank, url: "../monopoly-frontend/src/images/2.png")
community_chest1 = Property.create(name: 'Community Chest', set: 'Community Chest', player: the_bank, url: "../monopoly-frontend/src/images/3.png")
whitechapel_road = Property.create(name: 'Whitechapel Road', set: 'Brown', price: 60, rent: 4, mortgage_val: 30, player: the_bank, url: "../monopoly-frontend/src/images/4.png")
income_tax = Property.create(name: 'Income Tax', set: 'Tax', price: 200, player: the_bank, url: "../monopoly-frontend/src/images/5.png")
kings_cross_station = Property.create(name: 'Kings Cross Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank, url: "../monopoly-frontend/src/images/6.png")
the_angel_islington = Property.create(name: 'The Angel, Islington', set: 'Light Blue', price: 100, rent: 6, mortgage_val: 50, player: the_bank, url: "../monopoly-frontend/src/images/7.png")
chance1 = Property.create(name: 'Chance', set: 'Chance', player: the_bank, url: "../monopoly-frontend/src/images/8.png")
euston_road = Property.create(name: 'Euston Road', set: 'Light Blue', price: 100, rent: 6, mortgage_val: 50, player: the_bank, url: "../monopoly-frontend/src/images/9.png")
pentonville_road = Property.create(name: 'Pentonville Road', set: 'Light Blue', price: 120, rent: 8, mortgage_val: 60, player: the_bank, url: "../monopoly-frontend/src/images/10.png")
jail = Property.create(name: 'Jail', player: the_bank)
pall_mall = Property.create(name: 'Pall Mall', set: 'Pink', price: 140, rent: 10, mortgage_val: 70, player: the_bank, url: "../monopoly-frontend/src/images/12.png")
electric_company = Property.create(name: 'Electric Company', set: 'Utility', rent: nil ,price: 150, mortgage_val: 75, player: the_bank, url: "../monopoly-frontend/src/images/13.png")
whitehall = Property.create(name: 'Whitehall', set: 'Pink', price: 140, rent: 10, mortgage_val: 70, player: the_bank, url: "../monopoly-frontend/src/images/14.png")
northumberland_avenue = Property.create(name: 'Northumberland Avenue', set: 'Pink', price: 160, rent: 12, mortgage_val: 80, player: the_bank, url: "../monopoly-frontend/src/images/15.png")
marylebone_station = Property.create(name: 'Marylebone Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank, url: "../monopoly-frontend/src/images/16.png")
bow_street = Property.create(name: 'Bow Street', set: 'Orange', price: 180, rent: 14, mortgage_val: 90, player: the_bank, url: "../monopoly-frontend/src/images/17.png")
community_chest2 = Property.create(name: 'Community Chest', set: 'Community Chest', player: the_bank, url: "../monopoly-frontend/src/images/18.png")
marlborough_street = Property.create(name: 'Marlborough Street', set: 'Orange', price: 180, rent: 14, mortgage_val: 90, player: the_bank, url: "../monopoly-frontend/src/images/19.png")
vine_street = Property.create(name: 'Vine Street', set: 'Orange', price: 200, rent: 16, mortgage_val: 100, player: the_bank, url: "../monopoly-frontend/src/images/20.png")
free_parking = Property.create(name: 'Free Parking', player: the_bank)
strand = Property.create(name: 'Strand', set: 'Red', price: 220, rent: 18, mortgage_val: 110, player: the_bank, url: "../monopoly-frontend/src/images/22.png")
chance2 = Property.create(name: 'Chance', set: 'Chance', player: the_bank, url: "../monopoly-frontend/src/images/23.png")
fleet_street = Property.create(name: 'Fleet Street', set: 'Red', price: 220, rent: 18, mortgage_val: 110, player: the_bank, url: "../monopoly-frontend/src/images/24.png")
trafalgar_square = Property.create(name: 'Trafalgar Square', set: 'Red', price: 240, rent: 20, mortgage_val: 120, player: the_bank, url: "../monopoly-frontend/src/images/25.png")
fenchurch_street_station = Property.create(name: 'Fenchurch Street Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank, url: "../monopoly-frontend/src/images/26.png")
leicester_square = Property.create(name: 'Leicester Square', set: 'Yellow', price: 260, rent: 22, mortgage_val: 130, player: the_bank, url: "../monopoly-frontend/src/images/27.png")
coventry_street = Property.create(name: 'Coventry Street', set: 'Yellow', price: 260, rent: 22, mortgage_val: 130, player: the_bank, url: "../monopoly-frontend/src/images/28.png")
water_works = Property.create(name: 'Water Works', set: 'Utility', rent: nil, price: 150, mortgage_val: 75, player: the_bank, url: "../monopoly-frontend/src/images/29.png")
piccadilly = Property.create(name: 'Piccadilly', set: 'Yellow', price: 280, rent: 24, mortgage_val: 140, player: the_bank, url: "../monopoly-frontend/src/images/30.png")
go_to_jail = Property.create(name: 'Go To Jail', player: the_bank)
regent_street = Property.create(name: 'Regent Street', set: 'Green', price: 300, rent: 26, mortgage_val: 150, player: the_bank, url: "../monopoly-frontend/src/images/32.png")
oxford_street = Property.create(name: 'Oxford Street', set: 'Green', price: 300, rent: 26, mortgage_val: 150, player: the_bank, url: "../monopoly-frontend/src/images/33.png")
community_chest3 = Property.create(name: 'Community Chest', set: 'Community Chest', player: the_bank, url: "../monopoly-frontend/src/images/34.png")
bond_street = Property.create(name: 'Bond Street', set: 'Green', price: 320, rent: 28, mortgage_val: 160, player: the_bank, url: "../monopoly-frontend/src/images/35.png")
liverpool_street_station = Property.create(name: 'Liverpool Street Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank, url: "../monopoly-frontend/src/images/36.png")
chance1 = Property.create(name: 'Chance', set: 'Chance', player: the_bank, url: "../monopoly-frontend/src/images/37.png")
park_lane = Property.create(name: 'Park Lane', set: 'Dark Blue', price: 350, rent: 35, mortgage_val: 175, player: the_bank, url: "../monopoly-frontend/src/images/38.png")
super_tax = Property.create(name: 'Super Tax', set: 'Tax', price: 100, player: the_bank, url: "../monopoly-frontend/src/images/39.png")
mayfair = Property.create(name: 'Mayfair', set: 'Dark Blue', price: 400, rent: 50, mortgage_val: 200, player: the_bank, url: "../monopoly-frontend/src/images/40.png")
