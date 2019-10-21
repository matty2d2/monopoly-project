# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Property.delete_all
Player.delete_all


circle_url = 'https://cdn2.iconfinder.com/data/icons/user-account/95/2459-Brandfex-Icons-vector-74-512.png'

############## PLAYERS #######################
the_bank = Player.create(name: 'The Bank')
player1 = Player.create(name: 'Abdullah', cash: 1500, piece: circle_url, currently_on: 1)

############## PROPERTIES #######################
go = Property.create(name: 'Go', player: the_bank)
old_kent_road = Property.create(name: 'Old Kent Road', set: 'Brown', price: 60, rent: 2, mortgage_val: 30, player: the_bank)
community_chest1 = Property.create(name: 'Community Chest', set: 'Community Chest', player: the_bank)
whitechapel_road = Property.create(name: 'Whitechapel Road', set: 'Brown', price: 60, rent: 4, mortgage_val: 30, player: the_bank)
income_tax = Property.create(name: 'Income Tax', set: 'Tax', player: the_bank)
kings_cross_station = Property.create(name: 'Kings Cross Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank)
the_angel_islington = Property.create(name: 'The Angel, Islington', set: 'Light Blue', price: 100, rent: 6, mortgage_val: 50, player: the_bank)
chance1 = Property.create(name: 'Chance', set: 'Chance', player: the_bank)
euston_road = Property.create(name: 'Euston Road', set: 'Light Blue', price: 100, rent: 6, mortgage_val: 50, player: the_bank)
pentonville_road = Property.create(name: 'Pentonville Road', set: 'Light Blue', price: 120, rent: 8, mortgage_val: 60, player: the_bank)
jail = Property.create(name: 'Jail', player: the_bank)
pall_mall = Property.create(name: 'Pall Mall', set: 'Pink', price: 140, rent: 10, mortgage_val: 70, player: the_bank)
electric_company = Property.create(name: 'Electric Company', set: 'Utility', price: 150, mortgage_val: 75, player: the_bank)
whitehall = Property.create(name: 'Whitehall', set: 'Pink', price: 140, rent: 10, mortgage_val: 70, player: the_bank)
northumberland_avenue = Property.create(name: 'Northumberland Avenue', set: 'Pink', price: 160, rent: 12, mortgage_val: 80, player: the_bank)
marylebone_station = Property.create(name: 'Marylebone Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank)
bow_street = Property.create(name: 'Bow Street', set: 'Orange', price: 180, rent: 14, mortgage_val: 90, player: the_bank)
community_chest2 = Property.create(name: 'Community Chest', set: 'Community Chest', player: the_bank)
marlborough_street = Property.create(name: 'Marlborough Street', set: 'Orange', price: 180, rent: 14, mortgage_val: 90, player: the_bank)
vine_street = Property.create(name: 'Vine Street', set: 'Orange', price: 200, rent: 16, mortgage_val: 100, player: the_bank)
free_parking = Property.create(name: 'Free Parking', player: the_bank)
strand = Property.create(name: 'Strand', set: 'Red', price: 220, rent: 18, mortgage_val: 110, player: the_bank)
chance2 = Property.create(name: 'Chance', set: 'Chance', player: the_bank)
fleet_street = Property.create(name: 'Fleet Street', set: 'Red', price: 220, rent: 18, mortgage_val: 110, player: the_bank)
trafalgar_square = Property.create(name: 'Trafalgar Square', set: 'Red', price: 240, rent: 20, mortgage_val: 120, player: the_bank)
fenchurch_street_station = Property.create(name: 'Fenchurch Street Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank)
leicester_square = Property.create(name: 'Leicester Square', set: 'Yellow', price: 260, rent: 22, mortgage_val: 130, player: the_bank)
coventry_street = Property.create(name: 'Coventry Street', set: 'Yellow', price: 260, rent: 22, mortgage_val: 130, player: the_bank)
water_works = Property.create(name: 'Water Works', set: 'Utility', price: 150, mortgage_val: 75, player: the_bank)
piccadilly = Property.create(name: 'Piccadilly', set: 'Yellow', price: 280, rent: 24, mortgage_val: 140, player: the_bank)
go_to_jail = Property.create(name: 'Go To Jail', player: the_bank)
regent_street = Property.create(name: 'Regent Street', set: 'Green', price: 300, rent: 26, mortgage_val: 150, player: the_bank)
oxford_street = Property.create(name: 'Oxford Street', set: 'Green', price: 300, rent: 26, mortgage_val: 150, player: the_bank)
community_chest3 = Property.create(name: 'Community Chest', set: 'Community Chest', player: the_bank)
bond_street = Property.create(name: 'Bond Street', set: 'Green', price: 320, rent: 28, mortgage_val: 160, player: the_bank)
liverpool_street_station = Property.create(name: 'Liverpool Street Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100, player: the_bank)
chance1 = Property.create(name: 'Chance', set: 'Chance', player: the_bank)
park_lane = Property.create(name: 'Park Lane', set: 'Dark Blue', price: 350, rent: 35, mortgage_val: 175, player: the_bank)
super_tax = Property.create(name: 'Super Tax', set: 'Tax', player: the_bank)
mayfair = Property.create(name: 'Mayfair', set: 'Dark Blue', price: 400, rent: 50, mortgage_val: 200, player: the_bank)
