<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="theme-color" content="#3b82f6" />
  <title>Todo</title>
  <link rel="shortcut icon" href="<?= $baseURL ?>favicon.ico" type="image/x-icon"/>
  <link rel="stylesheet" href="<?=$baseURL?>css/style.css" />
  <script src="<?=$baseURL?>js/app.js" defer></script>
</head>
<body>
  <main class="container">
    <header class="bg-blue-500 rounded-b-lg shadow-lg h-28">
      <h1 class="font-bold text-2xl text-white px-4 pt-2">
        Todo
      </h1>
      <form class="flex justify-between items-center p-4" id="create-form">
        <input class="px-4 py-2 text-base rounded-l-lg grow" type="text" name="input" placeholder="Aa" autocomplete="off" />
        <button class="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
          <i class="fa-solid fa-plus"></i>
        </button>
      </form>
    </header>

    <div class="h-[calc(100vh-7rem)]">
      <div class="py-4 h-full overflow-hidden">
        <div class="h-full overflow-auto" id="item-container">

          <?php
            if ($todo->error) echo '<div>' . $todo->error . '</div>';
            else {
              $documents = $todo->documents;
              if (count($documents) < 1) {
                echo <<< HTML
                  <div class="shadow-md bg-gray-100 rounded-lg p-4 flex mb-4" id="item-placeholder">
                    <span class="grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden">
                      📃 List is empty.
                    </span>
                  </div>
                HTML;
              }
              foreach ($documents as &$document) {
                $lineThrough = $document->isDone ? 'line-through ' : '';
                $content = htmlspecialchars($document->content);
                echo <<< HTML
                  <div class="shadow-md bg-gray-100 rounded-lg p-4 flex mb-4" data-item-id="$document->itemId" data-is-done="$document->isDone">
                    <span class="item-content $lineThrough grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden">
                      $content
                    </span>
                    <div class="w-auto ml-4 text-white text-center flex flex-col">
                      <button class="delete-btn bg-red-500 rounded-t-lg px-2 py-1 hover:bg-red-600">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                      <button class="update-btn bg-blue-500 rounded-b-lg px-2 py-1 hover:bg-blue-700">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                    </div>
                  </div>
                HTML;
              }
            }
          ?>

        </div>
      </div>
    </div>
  </main>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/js/fontawesome.min.js" integrity="sha512-TXHaOs+47HgWwY4hUqqeD865VIBRoyQMjI27RmbQVeKb1pH1YTq0sbuHkiUzhVa5z0rRxG8UfzwDjIBYdPDM3Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</body>
</html>