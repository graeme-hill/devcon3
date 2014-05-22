# Capitalizes the first letter of the given string
function Capitalize($name) {
    return $name.Substring(0, 1).ToUpper() + $name.Substring(1)
}

function Format-Person {
    param(
        [Parameter(
            Position=0, 
            Mandatory=$true, 
            ValueFromPipeline=$true, 
            ValueFromPipelineByPropertyName=$true)]$People,
        [switch]$Capitalize)

    process {
        foreach ($person in $People) {
           $names = $person.Name.Split(" ")
           $firstName = $names[0]
           $lastName = $names[1]
           
           if ($Capitalize) {
               $firstName = Capitalize($firstName)
               $lastName = Capitalize($lastName)
           }

           Write-Output @{ 
               "FirstName" = $firstName;
               "LastName" = $lastName;
               "FavoriteColor" = $person.FavoriteColor
           }
        }
    }
}

Get-Content 'people.json' -Raw | ConvertFrom-Json | Format-Person -Capitalize | ConvertTo-Json | Out-File "people_fixed.json"
