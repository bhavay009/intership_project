-- Realistic Seeding for Agnayi CRM
-- Note: Run this in the Supabase SQL Editor

-- 1. Clear existing test data (Optional, recommended for clean demo)
-- DELETE FROM deals;
-- DELETE FROM clients;
-- DELETE FROM properties;
-- DELETE FROM leads;

-- 2. Insert Realistic Properties
INSERT INTO properties (title, type, price, location, size_sqft, bedrooms, bathrooms, amenities, availability_status, image_url)
VALUES 
('Azure Waterfront Villa', 'Villa', 4250000, 'Emerald Bay, FL', 5200, 5, 6, 'Infinity Pool, Private Dock, Smart Home', 'Available', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200'),
('The Penthouse at Skyline', 'Apartment', 2800000, 'Downtown Metro', 3100, 3, 3, 'Concierge, Rooftop Garden, Floor-to-ceiling windows', 'Available', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'),
('Modernist Hillside Retreat', 'House', 1950000, 'Silverwood Falls', 4200, 4, 4, 'Wine Cellar, Home Theater, Mountain View', 'Pending', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'),
('Commerce Central Hub', 'Commercial', 8500000, 'Financial District', 12000, 0, 8, 'Fiber Internet, 24/7 Security, Underground Parking', 'Available', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'),
('Rustic Pine Estate', 'House', 890000, 'Northwood Preserve', 2800, 3, 2, 'Fireplace, Outdoor Kitchen, Hiking Trails', 'Sold', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200');

-- 3. Insert Realistic Leads
INSERT INTO leads (name, email, phone, source, status, score, budget, assigned_agent)
VALUES 
('Jonathan Sterling', 'j.sterling@outlook.com', '+1 (555) 102-3944', 'Referral', 'Qualified', 'Hot', '$3M - $5M', 'Sarah J.'),
('Elena Rodriguez', 'elena.rod@gmail.com', '+1 (555) 293-8821', 'Website', 'New', 'Warm', '$1.5M - $2M', 'Mike T.'),
('Marcus Chen', 'm.chen@tech-corp.com', '+1 (555) 902-1145', 'Google Ads', 'Contacted', 'Hot', '$5M+', 'Sarah J.'),
('Sophia Williams', 'sophia.w@me.com', '+1 (555) 304-5822', 'Zillow', 'Lost', 'Cold', '$800K', 'Emma W.'),
('David Henderson', 'd.henderson@realestate-inv.com', '+1 (555) 772-1029', 'LinkedIn', 'Qualified', 'Warm', '$10M+', 'David L.');

-- 4. Insert Realistic Clients
INSERT INTO clients (name, email, phone, buyer_or_seller, preferences, visited_properties)
VALUES 
('Sarah Montgomery', 's.montgomery@architect.com', '+1 (555) 443-1022', 'Buyer', 'Prefers sustainable materials and open floor plans.', 'Azure Waterfront Villa, The Penthouse at Skyline'),
('Robert Vance', 'rvance@vance-refrigeration.com', '+1 (555) 991-4402', 'Seller', 'Looking to downsize from estate to luxury condo.', 'Modernist Hillside Retreat'),
('Linda Kasabian', 'linda.k@lifestyle.com', '+1 (555) 123-4567', 'Both', 'Interested in investment multi-unit properties.', 'Commerce Central Hub');

-- 5. Insert Realistic Deals
INSERT INTO deals (client_name, property_name, amount, stage, commission, closing_date, assigned_agent)
VALUES 
('Sarah Montgomery', 'Azure Waterfront Villa', 4150000, 'Negotiation', 3.5, '2026-06-15', 'Sarah J.'),
('Robert Vance', 'Modernist Hillside Retreat', 1900000, 'Agreement', 2.5, '2026-05-20', 'Emma W.'),
('Linda Kasabian', 'The Penthouse at Skyline', 2750000, 'Inquiry', 3.0, '2026-07-10', 'Mike T.');
