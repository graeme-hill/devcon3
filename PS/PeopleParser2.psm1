# Capitalizes the first letter of the given string
function Capitalize($name) {
    return $name.Substring(0, 1).ToUpper() + $name.Substring(1)
}

function Format-Person {
    <#
    .SYNOPSIS
    Cleans up Person objects by converting from old ugly format to nice new format.

    .DESCRIPTION
    Expects objects to have Name and FavoriteColor. Result objects have FirstName,
    LastName, and FavoriteColor.

    .PARAMETER People
    A collection of people to convert. This can be provided as a regular parameter or
    as pipeline input.

    .PARAMETER Capitalize
    If this switch is set the the first letter of each name will be capitalized.

    .EXAMPLE
    Read people from JSON and format them:

    Get-Content data.json -Raw | ConvertFrom-Json | Format-Person

    .EXAMPLE
    Read people from CSV and format them with capitalization:

    Get-Content data.csv -Raw | ConvertFrom-Csv | Format-Person -Capitalize
    #>

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

           New-Object PSObject -Property @{ 
               FirstName = $firstName
               LastName = $lastName
               FavoriteColor = $person.FavoriteColor
           }
        }
    }
}

function Repair-People() {
    param(
        [string]$InFile,
        [string]$OutFile)

    Get-Content $InFile -Raw `
        | ConvertFrom-Json `
        | Format-Person -Capitalize `
        | ConvertTo-Json `
        | Out-File $OutFile

}

Export-ModuleMember Repair-People
Export-ModuleMember Format-Person
