--Answers to Assignment 2
--Insert the following new record to the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Modify the Tony Stark record to change the account_type to "Admin".
--Note: Using the primary key
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

--Delete the Tony Stark record from the database.
--Note: Using the primary key
DELETE FROM public.account
WHERE account_id = 1;

--Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = (SELECT inv_id FROM public.inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer');

--Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');