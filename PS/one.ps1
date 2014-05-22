# Extracts first name from full name and fixes capitalization
function GetFirstName($name) {
    return Capitalize($name.Split(" ")[0])   
}

# Extracts last name from full name and fixes capitalization
function GetLastName($name) {
    return Capitalize($name.Split(" ")[1])   
}

# Capitalizes the first letter of the given string
function Capitalize($name) {
    return $name.Substring(0, 1).ToUpper() + $name.Substring(1)
}

$peopleJson = Get-Content 'people.json' -Raw
$originalPeople = $peopleJson | ConvertFrom-Json
$resultPeople = @()

$originalPeople | ForEach-Object {
    $resultPeople += @{ 
        "FirstName" = GetFirstName($_.Name); 
        "LastName" = GetLastName($_.Name);
        "FavoriteColor" = $_.FavoriteColor 
    }
} 

$resultJson = ConvertTo-Json $resultPeople

$resultJson | Out-File "people_fixed.json"
