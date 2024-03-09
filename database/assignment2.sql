
-- 1) Insert
INSERT INTO public.account
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')


-- 2) Update
UPDATE
	public.account
SET
	account_type = 'Admin'
WHERE
	account_id = 1


-- 3) Delete
DELETE
FROM
	public.account
WHERE
	account_id = 1

-- Replace Test
-- SELECT REPLACE (inv_description, 'small interiors', 'a huge interior') FROM public.inventory WHERE inv_id = 10

-- 4) Update with replace
UPDATE
	public.inventory
SET
	inv_description = REPLACE (inv_description, 'small interiors', 'a huge interior')
WHERE
	inv_id = 10


-- 5) Inner Join
SELECT
	inv_make, inv_model, classification_name
FROM
	public.inventory
INNER JOIN public.classification ON 
	public.inventory.classification_id = public.classification.classification_id 
	WHERE public.classification.classification_id = 2 and public.inventory.classification_id = 2

-- Replace test two
-- SELECT 
-- 	REPLACE (inv_image, 'images/', 'images/vehicles/') AS inv_image,
-- 	REPLACE (inv_thumbnail, 'images/', 'images/vehicles/') AS inv_thumbnail
-- FROM public.inventory

-- 6) Update all records in public.inventory
UPDATE
	public.inventory
SET
	inv_image = REPLACE (inv_image, 'images/', 'images/vehicles/'),
  inv_thumbnail = REPLACE (inv_thumbnail, 'images/', 'images/vehicles/');
