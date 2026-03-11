$Pasta = Read-Host "Digite o caminho da pasta"

# Verificamos o caminho usando LiteralPath para evitar erros se a pasta tiver []
if (-not (Test-Path -LiteralPath $Pasta)) {
    Write-Host "Caminho inválido ou inacessível." -ForegroundColor Red
    exit
}

$Extensoes = "*.mkv", "*.mp4", "*.avi"

# Buscamos os arquivos
Get-ChildItem -LiteralPath $Pasta -Recurse -Include $Extensoes | ForEach-Object {
    
    # 1. Remove o que está entre colchetes
    # 2. .Trim() remove espaços que sobrarem no início ou fim do nome
    $novoNome = ($_.Name -replace '\[.*?\]', '').Trim()
    
    # Só tenta renomear se o nome realmente mudou e não ficou vazio
    if ($_.Name -ne $novoNome -and $novoNome -ne "") {
        Write-Host "Renomeando: $($_.Name) `nPara: $novoNome" -ForegroundColor Cyan
        
        try {
            # O SEGREDO: Usar -LiteralPath para que os colchetes originais não causem erro
            Rename-Item -LiteralPath $_.FullName -NewName $novoNome -ErrorAction Stop
        } catch {
            Write-Host "Erro ao renomear $($_.Name): $($_.Exception.Message)" -ForegroundColor Yellow
        }
        Write-Host "---------------------------"
    }
}

Write-Host "Concluído!" -ForegroundColor Green