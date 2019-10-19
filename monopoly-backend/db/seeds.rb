# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Property.delete_all

go = Property.create(name: 'Go')
old_kent_road = Property.create(name: 'Old Kent Road', set: 'Brown', price: 60, rent: 2, mortgage_val: 30)
community_chest1 = Property.create(name: 'Community Chest', set: 'Community Chest')
whitechapel_road = Property.create(name: 'Whitechapel Road', set: 'Brown', price: 60, rent: 4, mortgage_val: 30)
income_tax = Property.create(name: 'Income Tax', set: 'Tax')
kings_cross_station = Property.create(name: 'Kings Cross Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100)
the_angel_islington = Property.create(name: 'The Angel, Islington', set: 'Light Blue', price: 100, rent: 6, mortgage_val: 50)
chance1 = Property.create(name: 'Chance', set: 'Chance')
euston_road = Property.create(name: 'Euston Road', set: 'Light Blue', price: 100, rent: 6, mortgage_val: 50)
pentonville_road = Property.create(name: 'Pentonville Road', set: 'Light Blue', price: 120, rent: 8, mortgage_val: 60)
jail = Property.create(name: 'Jail')
pall_mall = Property.create(name: 'Pall Mall', set: 'Pink', price: 140, rent: 10, mortgage_val: 70)
electric_company = Property.create(name: 'Electric Company', set: 'Utility', price: 150, mortgage_val: 75)
whitehall = Property.create(name: 'Whitehall', set: 'Pink', price: 140, rent: 10, mortgage_val: 70)
northumberland_avenue = Property.create(name: 'Northumberland Avenue', set: 'Pink', price: 160, rent: 12, mortgage_val: 80)
marylebone_station = Property.create(name: 'Marylebone Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100)
bow_street = Property.create(name: 'Bow Street', set: 'Orange', price: 180, rent: 14, mortgage_val: 90)
community_chest2 = Property.create(name: 'Community Chest', set: 'Community Chest')
marlborough_street = Property.create(name: 'Marlborough Street', set: 'Orange', price: 180, rent: 14, mortgage_val: 90)
vine_street = Property.create(name: 'Vine Street', set: 'Orange', price: 200, rent: 16, mortgage_val: 100)
free_parking = Property.create(name: 'Free Parking')
strand = Property.create(name: 'Strand', set: 'Red', price: 220, rent: 18, mortgage_val: 110)
chance2 = Property.create(name: 'Chance', set: 'Chance')
fleet_street = Property.create(name: 'Fleet Street', set: 'Red', price: 220, rent: 18, mortgage_val: 110)
trafalgar_square = Property.create(name: 'Trafalgar Square', set: 'Red', price: 240, rent: 20, mortgage_val: 120)
fenchurch_street_station = Property.create(name: 'Fenchurch Street Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100)
leicester_square = Property.create(name: 'Leicester Square', set: 'Yellow', price: 260, rent: 22, mortgage_val: 130)
coventry_street = Property.create(name: 'Coventry Street', set: 'Yellow', price: 260, rent: 22, mortgage_val: 130)
water_works = Property.create(name: 'Water Works', set: 'Utility', price: 150, mortgage_val: 75)
piccadilly = Property.create(name: 'Piccadilly', set: 'Yellow', price: 280, rent: 24, mortgage_val: 140)
go_to_jail = Property.create(name: 'Go To Jail')
regent_street = Property.create(name: 'Regent Street', set: 'Green', price: 300, rent: 26, mortgage_val: 150)
oxford_street = Property.create(name: 'Oxford Street', set: 'Green', price: 300, rent: 26, mortgage_val: 150)
community_chest3 = Property.create(name: 'Community Chest', set: 'Community Chest')
bond_street = Property.create(name: 'Bond Street', set: 'Green', price: 320, rent: 28, mortgage_val: 160)
liverpool_street_station = Property.create(name: 'Liverpool Street Station', set: 'Station', price: 200, rent: 25, mortgage_val: 100)
chance1 = Property.create(name: 'Chance', set: 'Chance')
park_lane = Property.create(name: 'Park Lane', set: 'Dark Blue', price: 350, rent: 35, mortgage_val: 175)
super_tax = Property.create(name: 'Super Tax', set: 'Tax')
mayfair = Property.create(name: 'Mayfair', set: 'Dark Blue', price: 400, rent: 50, mortgage_val: 200)
