$FullPath = $MyInvocation.MyCommand.Path.replace($MyInvocation.MyCommand.Name, '')
Get-ChildItem -Path ($FullPath + '/*.env') | ForEach-Object {
    Select-String -Path $_.FullName -Pattern 'error' -context 5 | Select-Object FileName, Path
    if("template.env" -ne $_.Name) {
      get-content ($FullPath + $_.Name) | foreach {
          $name, $value = $_.split('=')
          set-content env:\$name $value
      }
    }
}