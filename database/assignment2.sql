-- Query 1 inserting data into the account table
INSERT INTO public.account
(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

-- Query 2 updating the account_type

UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1; 

-- Query 3 Deleting the Tony Stark record from the database
DELETE FROM public.account WHERE account_id = 1;

-- Query 4 Changing invetory description
UPDATE 
  public.inventory
SET 
  inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Query 5 Joining data
SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';
-- Query 6 Updating image paths
UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/'),
inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/');