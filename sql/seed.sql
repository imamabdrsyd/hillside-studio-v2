-- ============================================
-- HILLSIDE STUDIO FINANCE APP v2
-- Seed Data dari HILLSIDE_STUDIO_v2.xlsx
-- ============================================

-- Clear existing data (untuk development)
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;

-- ============================================
-- JANUARY 2025
-- ============================================
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-01-01', 'VAR', 'Battery ABC', 0, 17300, 'Jago'),
('2025-01-02', 'EARN', '4 nights/Laras Dipa Pramudita', 1569882, 0, 'BCA'),
('2025-01-02', 'VAR', 'Guest Fee (Laras Dipa Pramudita)', 0, 212682, 'Airbnb'),
('2025-01-02', 'VAR', 'Airbnb 3% Host Fee (Laras Dipa Pramudita)', 0, 40716, 'Airbnb'),
('2025-01-02', 'TAX', 'PPN by 3% Host Fee (Laras Dipa Pramudita)', 0, 4479, 'Dirjen Pajak'),
('2025-01-04', 'FIN', 'Owners Withdrawal', 0, 811597, 'Cash'),
('2025-01-05', 'VAR', 'Galon Aqua', 0, 21000, 'BCA'),
('2025-01-08', 'VAR', 'Laundry Nicko', 0, 81000, 'BCA'),
('2025-01-09', 'EARN', '2 nights/Edwin Zainudin', 728726, 0, 'BCA'),
('2025-01-09', 'VAR', 'Guest Fee (Edwin Zainudin)', 0, 98726, 'Airbnb'),
('2025-01-09', 'VAR', 'Airbnb 3% Host Fee (Edwin Zainudin)', 0, 18900, 'Airbnb'),
('2025-01-09', 'TAX', 'PPN by 3% Host Fee (Edwin Zainudin)', 0, 2079, 'Dirjen Pajak'),
('2025-01-10', 'CAPEX', 'Vitrase', 0, 240000, 'BCA'),
('2025-01-11', 'VAR', 'Galon Aqua', 0, 21000, 'Cash'),
('2025-01-12', 'EARN', '1 night/Luisa Herawaty', 880170, 0, 'BCA'),
('2025-01-12', 'VAR', 'Guest Fee (Luisa Herawaty)', 0, 120170, 'Airbnb'),
('2025-01-12', 'VAR', 'Airbnb 3% Host Fee (Luisa Herawaty)', 0, 22800, 'Airbnb'),
('2025-01-12', 'TAX', 'PPN by 3% Host Fee (Luisa Herawaty)', 0, 2736, 'Dirjen Pajak'),
('2025-01-14', 'VAR', 'Laundry', 0, 54000, 'Cash'),
('2025-01-15', 'VAR', 'Tissue 4pcs', 0, 17340, 'Cash'),
('2025-01-17', 'EARN', '1 night/Andhika Badai', 284825, 0, 'BCA'),
('2025-01-17', 'VAR', 'Guest Fee (Andhika Badai)', 0, 38587, 'Airbnb'),
('2025-01-17', 'VAR', 'Airbnb 3% Host Fee (Andhika Badai)', 0, 7387, 'Airbnb'),
('2025-01-17', 'TAX', 'PPN by 3% Host Fee (Andhika Badai)', 0, 813, 'Dirjen Pajak'),
('2025-01-18', 'VAR', 'Sabun, Karbol, Pewangi', 0, 70825, 'Cash'),
('2025-01-18', 'VAR', 'Laundry', 0, 88200, 'Cash'),
('2025-01-18', 'VAR', 'Kapal Api 20x', 0, 22500, 'Cash'),
('2025-01-19', 'OPEX', 'Indihome', 0, 319808, 'BCA'),
('2025-01-20', 'EARN', '1 night/Revian Arifin', 284825, 0, 'BCA'),
('2025-01-20', 'VAR', 'Guest Fee (Revian Arifin)', 0, 38587, 'Airbnb'),
('2025-01-20', 'VAR', 'Airbnb 3% Host Fee (Revian Arifin)', 0, 7387, 'Airbnb'),
('2025-01-20', 'TAX', 'PPN by 3% Host Fee (Revian Arifin)', 0, 813, 'Dirjen Pajak'),
('2025-01-20', 'EARN', '1 night/Gerry Agriansyah', 404847, 0, 'BCA'),
('2025-01-20', 'VAR', 'Guest Fee (Gerry Agriansyah)', 0, 54847, 'Airbnb'),
('2025-01-20', 'VAR', 'Airbnb 3% Host Fee (Gerry Agriansyah)', 0, 10500, 'Airbnb'),
('2025-01-20', 'TAX', 'PPN by 3% Host Fee (Gerry Agriansyah)', 0, 1155, 'Dirjen Pajak'),
('2025-01-20', 'EARN', '1 night/Rizky Lukman', 771307, 0, 'BCA'),
('2025-01-20', 'VAR', 'Guest Fee (Rizky Lukman)', 0, 105307, 'Airbnb'),
('2025-01-20', 'VAR', 'Airbnb 3% Host Fee (Rizky Lukman)', 0, 19980, 'Airbnb'),
('2025-01-20', 'TAX', 'PPN by 3% Host Fee (Rizky Lukman)', 0, 2398, 'Dirjen Pajak'),
('2025-01-20', 'OPEX', 'IPL', 0, 776024, 'Jago'),
('2025-01-22', 'OPEX', 'Kuota XL', 0, 136000, 'Cash'),
('2025-01-23', 'EARN', '3 nights/Karina Aditya', 1231893, 0, 'BCA'),
('2025-01-23', 'VAR', 'Guest Fee (Karina Aditya)', 0, 166893, 'Airbnb'),
('2025-01-23', 'VAR', 'Airbnb 3% Host Fee (Karina Aditya)', 0, 31950, 'Airbnb'),
('2025-01-23', 'TAX', 'PPN by 3% Host Fee (Karina Aditya)', 0, 3514, 'Dirjen Pajak'),
('2025-01-24', 'OPEX', 'Kosan', 0, 665000, 'Jago'),
('2025-01-28', 'OPEX', 'Netflix', 0, 120000, 'Cash'),
('2025-01-30', 'EARN', '2 nights/Paramita Kusumawardani', 947341, 0, 'BCA'),
('2025-01-30', 'VAR', 'Guest Fee (Paramita Kusumawardani)', 0, 128341, 'Airbnb'),
('2025-01-30', 'VAR', 'Airbnb 3% Host Fee (Paramita Kusumawardani)', 0, 24570, 'Airbnb'),
('2025-01-30', 'TAX', 'PPN by 3% Host Fee (Paramita Kusumawardani)', 0, 2703, 'Dirjen Pajak');

-- ============================================
-- FEBRUARY 2025
-- ============================================
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-02-01', 'VAR', 'Laundry', 0, 342000, 'Cash'),
('2025-02-01', 'VAR', 'Tissue 400sheet', 0, 25500, 'Cash'),
('2025-02-01', 'VAR', 'Aqua Galon', 0, 21000, 'Cash'),
('2025-02-03', 'EARN', '1 night/Dewanti Ramadhani', 520518, 0, 'BCA'),
('2025-02-03', 'VAR', 'Guest Fee (Dewanti Ramadhani)', 0, 70518, 'Airbnb'),
('2025-02-03', 'VAR', 'Airbnb 3% Host Fee (Dewanti Ramadhani)', 0, 13500, 'Airbnb'),
('2025-02-03', 'TAX', 'PPN by 3% Host Fee (Dewanti Ramadhani)', 0, 1485, 'Dirjen Pajak'),
('2025-02-05', 'CAPEX', 'Handuk 2pcs', 0, 147000, 'BCA'),
('2025-02-05', 'VAR', 'Parkir buat tamu', 0, 3000, 'Cash'),
('2025-02-05', 'VAR', 'Ongkos kantor-apart', 0, 5000, 'Cash'),
('2025-02-06', 'EARN', '1 night/Silmi Sabila', 326026, 0, 'BCA'),
('2025-02-06', 'VAR', 'Guest Fee (Silmi Sabila)', 0, 44169, 'Airbnb'),
('2025-02-06', 'VAR', 'Airbnb 3% Host Fee (Silmi Sabila)', 0, 8456, 'Airbnb'),
('2025-02-06', 'TAX', 'PPN by 3% Host Fee (Silmi Sabila)', 0, 930, 'Dirjen Pajak'),
('2025-02-10', 'EARN', '3 nights/Aqila Afiqa', 1471391, 0, 'BCA'),
('2025-02-10', 'VAR', 'Guest Fee (Aqila Afiqa)', 0, 221391, 'Airbnb'),
('2025-02-10', 'VAR', 'Airbnb 3% Host Fee (Aqila Afiqa)', 0, 37506, 'Airbnb'),
('2025-02-10', 'TAX', 'PPN by 3% Host Fee (Aqila Afiqa)', 0, 4126, 'Dirjen Pajak'),
('2025-02-14', 'VAR', 'Belanja Perintilan', 0, 142550, 'Cash'),
('2025-02-14', 'CAPEX', 'Keset Besar', 0, 184500, 'Cash'),
('2025-02-14', 'CAPEX', 'Lap Dapur', 0, 13700, 'Cash'),
('2025-02-14', 'CAPEX', 'Lap Kotor', 0, 7550, 'Cash'),
('2025-02-14', 'CAPEX', 'Keset Handuk', 0, 47950, 'Cash'),
('2025-02-17', 'OPEX', 'Kuota XL', 0, 136000, 'Cash'),
('2025-02-19', 'EARN', '5 nights/Fasyekh Khoirul Mubarrok', 2220877, 0, 'BCA'),
('2025-02-19', 'VAR', 'Guest Fee (Fasyekh Khoirul Mubarrok)', 0, 63936, 'Airbnb'),
('2025-02-19', 'VAR', 'Airbnb 3% Host Fee (Fasyekh Khoirul Mubarrok)', 0, 57600, 'Airbnb'),
('2025-02-19', 'TAX', 'PPN by 3% Host Fee (Fasyekh Khoirul Mubarrok)', 0, 6336, 'Dirjen Pajak'),
('2025-02-20', 'OPEX', 'Indihome', 0, 316350, 'BCA'),
('2025-02-20', 'OPEX', 'IPL', 0, 832300, 'BCA'),
('2025-02-21', 'CAPEX', 'Selang Shower', 0, 80000, 'Cash'),
('2025-02-23', 'EARN', '2 nights/Norish Emylia', 1024092, 0, 'BCA'),
('2025-02-23', 'VAR', 'Guest Fee (Norish Emylia)', 0, 154092, 'Airbnb'),
('2025-02-23', 'VAR', 'Airbnb 3% Host Fee (Norish Emylia)', 0, 26117, 'Airbnb'),
('2025-02-23', 'TAX', 'PPN by 3% Host Fee (Norish Emylia)', 0, 2873, 'Dirjen Pajak'),
('2025-02-24', 'OPEX', 'Kosan', 0, 665000, 'Cash');

-- ============================================
-- APRIL 2025
-- ============================================
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-04-02', 'VAR', 'Pewangi Lantai', 0, 11900, 'Cash'),
('2025-04-03', 'VAR', 'Cleaning Stuff, etc.', 0, 116800, 'Cash'),
('2025-04-03', 'CAPEX', 'Bracket Remot AC', 0, 30000, 'Cash'),
('2025-04-04', 'VAR', 'Laundry', 0, 406400, 'Cash'),
('2025-04-05', 'OPEX', 'Netflix', 0, 120000, 'Cash'),
('2025-04-06', 'OPEX', 'Kuota XL', 0, 92000, 'Cash'),
('2025-04-06', 'EARN', '1 night/Andhika Badai', 302000, 0, 'BCA'),
('2025-04-08', 'EARN', '1 night/Fathiyah Khairiyah', 496227, 0, 'BCA'),
('2025-04-08', 'VAR', 'Guest Fee (Fathiyah Khairiyah)', 0, 67227, 'Airbnb'),
('2025-04-08', 'VAR', 'Airbnb 3% Host Fee (Fathiyah Khairiyah)', 0, 12870, 'Airbnb'),
('2025-04-08', 'TAX', 'PPN by 3% Host Fee (Fathiyah Khairiyah)', 0, 1416, 'Dirjen Pajak'),
('2025-04-13', 'CAPEX', 'Handuk 2pcs', 0, 147000, 'Cash'),
('2025-04-13', 'VAR', 'Tissue IDM NP400', 0, 20400, 'Cash'),
('2025-04-13', 'EARN', '2 nights/Nanang', 705591, 0, 'BCA'),
('2025-04-13', 'VAR', 'Guest Fee (Nanang)', 0, 95591, 'Airbnb'),
('2025-04-13', 'VAR', 'Airbnb 3% Host Fee (Nanang)', 0, 18300, 'Airbnb'),
('2025-04-13', 'TAX', 'PPN by 3% Host Fee (Nanang)', 0, 2013, 'Dirjen Pajak'),
('2025-04-15', 'EARN', '1 night/Rachma Cintya Ningrum', 381713, 0, 'BCA'),
('2025-04-15', 'VAR', 'Guest Fee (Rachma Cintya Ningrum)', 0, 51713, 'Airbnb'),
('2025-04-15', 'VAR', 'Airbnb 3% Host Fee (Rachma Cintya Ningrum)', 0, 9900, 'Airbnb'),
('2025-04-15', 'TAX', 'PPN by 3% Host Fee (Rachma Cintya Ningrum)', 0, 1089, 'Dirjen Pajak'),
('2025-04-15', 'OPEX', 'WiFi Kosan', 0, 50000, 'Cash'),
('2025-04-18', 'EARN', '2 nights/Yunie Adelia', 665106, 0, 'BCA'),
('2025-04-18', 'VAR', 'Guest Fee (Yunie Adelia)', 0, 90106, 'Airbnb'),
('2025-04-18', 'VAR', 'Airbnb 3% Host Fee (Yunie Adelia)', 0, 17250, 'Airbnb'),
('2025-04-18', 'TAX', 'PPN by 3% Host Fee (Yunie Adelia)', 0, 1897, 'Dirjen Pajak'),
('2025-04-20', 'EARN', '2 nights/Mega Oriska Aprani', 645442, 0, 'BCA'),
('2025-04-20', 'VAR', 'Guest Fee (Mega Oriska Aprani)', 0, 87442, 'Airbnb'),
('2025-04-20', 'VAR', 'Airbnb 3% Host Fee (Mega Oriska Aprani)', 0, 16740, 'Airbnb'),
('2025-04-20', 'TAX', 'PPN by 3% Host Fee (Mega Oriska Aprani)', 0, 1841, 'Dirjen Pajak'),
('2025-04-20', 'OPEX', 'Indihome', 0, 316350, 'BCA'),
('2025-04-20', 'OPEX', 'IPL', 0, 712600, 'BCA'),
('2025-04-25', 'OPEX', 'Kosan', 0, 650000, 'Cash'),
('2025-04-27', 'VAR', 'Housekeeping 2x: Juwita', 0, 100000, 'Cash'),
('2025-04-28', 'EARN', '1 night/Ami Mahfira', 421041, 0, 'BCA'),
('2025-04-28', 'VAR', 'Guest Fee (Ami Mahfira)', 0, 57041, 'Airbnb'),
('2025-04-28', 'VAR', 'Airbnb 3% Host Fee (Ami Mahfira)', 0, 10920, 'Airbnb'),
('2025-04-28', 'TAX', 'PPN by 3% Host Fee (Ami Mahfira)', 0, 1201, 'Dirjen Pajak');

-- ============================================
-- MAY - DECEMBER 2025 (Ringkasan)
-- ============================================

-- MAY
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-05-04', 'EARN', '1 night/Nuno Luz', 536077, 0, 'BCA'),
('2025-05-04', 'EARN', 'Early Check-In 5 hours/Nuno Luz', 80000, 0, 'BCA'),
('2025-05-05', 'OPEX', 'Kosan', 0, 700000, 'Cash'),
('2025-05-05', 'EARN', '1 night/Mutiara P', 485816, 0, 'BCA'),
('2025-05-14', 'EARN', '2 nights/Jehan Zafira', 820000, 0, 'BCA'),
('2025-05-14', 'EARN', '2 nights/Dinda Budi Noviyanti', 986671, 0, 'BCA'),
('2025-05-20', 'OPEX', 'Indihome', 0, 316350, 'BCA'),
('2025-05-20', 'OPEX', 'IPL', 0, 781288, 'BCA'),
('2025-05-31', 'EARN', '2 nights/Adhika Salma', 941559, 0, 'BCA'),
('2025-05-31', 'EARN', '1 night/Elvina', 462683, 0, 'BCA');

-- JUNE
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-06-01', 'EARN', '3 nights/Ashabul Kahfi', 1388332, 0, 'BCA'),
('2025-06-01', 'VAR', 'Guest Fee (Ashabul Kahfi)', 0, 228332, 'Airbnb'),
('2025-06-01', 'TAX', 'PPN by 3% Host Fee (Ashabul Kahfi)', 0, 3827, 'Dirjen Pajak'),
('2025-06-07', 'EARN', '3 nights/Ronny Surya', 1329000, 0, 'BCA'),
('2025-06-07', 'VAR', 'Komisi Booking.com (Ronny Surya)', 0, 199350, 'Booking.com'),
('2025-06-07', 'TAX', 'PPN (Ronny Surya)', 0, 25291, 'Dirjen Pajak'),
('2025-06-18', 'EARN', '1 night/Rifat', 400000, 0, 'Cash'),
('2025-06-20', 'OPEX', 'Indihome', 0, 316350, 'BCA'),
('2025-06-20', 'OPEX', 'IPL', 0, 760120, 'BCA'),
('2025-06-20', 'OPEX', 'Kosan', 0, 700000, 'Cash'),
('2025-06-23', 'EARN', '1 night/Fransiskus D', 485816, 0, 'BCA'),
('2025-06-29', 'EARN', '2 nights/Priskila Wijaya', 913798, 0, 'BCA');

-- JULY
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-07-01', 'EARN', '1 month/Hanhan Wang', 4000000, 0, 'Cash'),
('2025-07-01', 'EARN', 'Wanhan Rental Deposit', 2000000, 0, 'Cash'),
('2025-07-23', 'OPEX', 'Kosan', 0, 700000, 'Cash');

-- AUGUST
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-08-01', 'EARN', '26 nights/Hanhan Wang', 4000000, 0, 'Cash'),
('2025-08-18', 'OPEX', 'Netflix', 0, 120000, 'Cash'),
('2025-08-25', 'OPEX', 'Kosan', 0, 700000, 'Cash'),
('2025-08-29', 'EARN', '3 nights/Fernando Noverio', 1329000, 0, 'BCA'),
('2025-08-29', 'VAR', 'Komisi Booking.com (Fernando Noverio)', 0, 199350, 'Booking.com'),
('2025-08-29', 'TAX', 'PPN (Fernando Noverio)', 0, 25291, 'Dirjen Pajak');

-- SEPTEMBER
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-09-04', 'EARN', '2 nights/Difa Salsabila', 886000, 0, 'BCA'),
('2025-09-04', 'VAR', 'Komisi Booking.com (Difa Salsabila)', 0, 132900, 'Booking.com'),
('2025-09-04', 'TAX', 'PPN (Difa Salsabila)', 0, 16861, 'Dirjen Pajak'),
('2025-09-06', 'EARN', '1 night/Juliawati', 497384, 0, 'BCA'),
('2025-09-12', 'EARN', '1 night/Afrigis Sabra + 50k', 564735, 0, 'BCA'),
('2025-09-20', 'OPEX', 'IPL', 0, 698128, 'BCA'),
('2025-09-20', 'OPEX', 'Indihome', 0, 316350, 'BCA'),
('2025-09-20', 'OPEX', 'Kosan', 0, 700000, 'Cash');

-- OCTOBER
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-10-04', 'EARN', '1 night/Megariski Yuda Pertiwi', 578354, 0, 'BCA'),
('2025-10-04', 'VAR', 'Guest Fee (Megariski Yuda Pertiwi)', 0, 78354, 'Airbnb'),
('2025-10-04', 'TAX', 'PPN by 3% Host Fee (Megariski)', 0, 1650, 'Dirjen Pajak'),
('2025-10-11', 'EARN', '1 night/Ahmad Dzikra', 578354, 0, 'BCA'),
('2025-10-20', 'OPEX', 'IPL', 0, 776752, 'BCA'),
('2025-10-20', 'OPEX', 'Internet', 0, 316350, 'BCA'),
('2025-10-24', 'EARN', '1 night/Febbyuli Arrissa', 578354, 0, 'BCA'),
('2025-10-26', 'TAX', 'Pajak Bumi dan Bangunan', 0, 178053, 'Cash'),
('2025-10-28', 'OPEX', 'Kosan', 0, 700000, 'Cash'),
('2025-10-31', 'CAPEX', 'Showerbox 90x90', 0, 3824150, 'BCA');

-- NOVEMBER
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-11-02', 'CAPEX', 'DP Renovasi Kamar Mandi', 0, 780000, 'Jago'),
('2025-11-04', 'CAPEX', 'Renovasi Kamar Mandi', 0, 520000, 'Jago'),
('2025-11-04', 'OPEX', 'Kosan', 0, 1300000, 'Cash'),
('2025-11-09', 'EARN', '2 nights/Teh Dhika', 500000, 0, 'BCA'),
('2025-11-17', 'EARN', '1 night/Aliendra', 404847, 0, 'BCA'),
('2025-11-17', 'EARN', '1 night/Mohamad Fadhillah Dekha Putra', 485816, 0, 'BCA'),
('2025-11-20', 'OPEX', 'Indihome', 0, 316350, 'BCA'),
('2025-11-20', 'OPEX', 'IPL', 0, 754424, 'BCA'),
('2025-11-22', 'EARN', '1 night/Muhammad Fattih Rizqi', 381713, 0, 'BCA');

-- DECEMBER
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
('2025-12-05', 'EARN', '2 nights/Nafisa Ardiningrum', 855963, 0, 'BCA'),
('2025-12-05', 'VAR', 'Guest Fee (Nafisa Ardiningrum)', 0, 115963, 'Airbnb'),
('2025-12-05', 'TAX', 'PPN by 3% Host Fee (Nafisa Ardiningrum)', 0, 2442, 'Dirjen Pajak'),
('2025-12-06', 'EARN', '1 night/Nafisa Ardiningrum (Extend)', 330000, 0, 'BCA'),
('2025-12-10', 'OPEX', 'Kosan', 0, 1300000, 'Cash'),
('2025-12-15', 'EARN', '4 nights/Nur Aziza Fitri', 1620546, 0, 'BCA'),
('2025-12-15', 'VAR', 'Guest Fee (Nur Aziza Fitri)', 0, 219546, 'Airbnb'),
('2025-12-15', 'TAX', 'PPN by 3% Host Fee (Nur Aziza Fitri)', 0, 4623, 'Dirjen Pajak'),
('2025-12-18', 'EARN', '2 nights/Vonna', 843239, 0, 'BCA'),
('2025-12-20', 'OPEX', 'Indihome', 0, 316350, 'BCA'),
('2025-12-21', 'OPEX', 'IPL', 0, 737700, 'BCA'),
('2025-12-23', 'EARN', '2 nights/Nina Vella', 936932, 0, 'BCA'),
('2025-12-24', 'EARN', '2 nights/Edy', 1087304, 0, 'BCA'),
('2025-12-26', 'EARN', '2 nights/Dewi Miryam Anita Putri', 1123162, 0, 'BCA'),
('2025-12-28', 'EARN', '1 night/Yumeico Sachi', 601487, 0, 'BCA');

-- ============================================
-- ASSETS DATA
-- ============================================
INSERT INTO assets (item_name, asset_type, purchase_price, quantity, purchase_date) VALUES
('Apartment, Type: Studio (30m2)', 'Property', 350000000, 1, '2024-04-26'),
('TV Sharp', 'Equipment', 0, 1, '2024-04-26'),
('Kulkas Toshiba', 'Equipment', 0, 1, '2024-04-26'),
('Kompor Listrik Modena', 'Equipment', 0, 1, '2024-04-26'),
('Rice Cooker', 'Equipment', 0, 1, '2024-04-26'),
('Water Heater', 'Equipment', 0, 1, '2024-04-26'),
('Microwave', 'Equipment', 0, 1, '2024-04-26'),
('Office Chair Deli', 'Furniture', 678000, 1, '2024-06-06'),
('Leather Desk Movio', 'Furniture', 59000, 1, '2024-06-07'),
('Vitrase', 'Linen', 240000, 1, '2025-01-10'),
('Handuk Indomaret', 'Linen', 294000, 4, '2025-02-05'),
('Keset Besar Beruang', 'Linen', 184500, 1, '2025-02-14'),
('Selang Shower', 'Equipment', 80000, 1, '2025-02-21'),
('Showerbox 90x90', 'Property', 3824150, 1, '2025-10-31'),
('Renovasi Kamar Mandi', 'Property', 1300000, 1, '2025-11-04');

-- ============================================
-- Verifikasi data
-- ============================================
SELECT 
    'Transactions' as table_name, 
    COUNT(*) as total_rows 
FROM transactions
UNION ALL
SELECT 
    'Assets' as table_name, 
    COUNT(*) as total_rows 
FROM assets;
